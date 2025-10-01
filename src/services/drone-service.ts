import { Drone, droneEntityMapper } from '../models/drone';
import { LoadingRequest } from '../models/dtos/loading-request';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../utils/api-error';
import * as medicationService from '../services/medication-service';
import { Medication } from '../models/medication';
import { DroneRegisterRequest } from '../models/dtos/drone-register-request';
import { DroneState } from '../enums/drone-state';
import { DroneDto } from '../models/dtos/drone-dto';

const batteryLevelMinimum = process.env.MINIMUM_BATTERY_CAPACITY ?? 25;

export const getAvailableDrones = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const query = `SELECT *
                   FROM drones
                   WHERE drone_state = ?
                   LIMIT ? OFFSET ?`;
  const rows = db.prepare(query).all(DroneState.Idle, limit, offset) as Drone[];
  return rows.map(droneEntityMapper);
};

export const getTotalAvailableDronesCount = (): number => {
  const query = `SELECT COUNT(*) as count
                   FROM drones
                   WHERE drone_state = ?`;
  const result = db.prepare(query).get(DroneState.Idle) as { count: number };
  return result.count;
};

export const getBatteryLevel = (droneSerialNumber: string) => {
  const query = `SELECT *
                   FROM drones
                   WHERE serial_number = ? `;
  const row = db.prepare(query).get(droneSerialNumber) as Drone;
  if (row) {
    return droneEntityMapper(row)?.batteryCapacity;
  } else {
    throw new ApiError(404, 'Drone information not available');
  }
};

export const getDrones = ({
  state,
  batteryLevel,
  model,
  serialNumber,
  page = 1,
  limit = 10,
}: {
  state?: string;
  batteryLevel?: number;
  model?: string;
  serialNumber?: string;
  page?: number;
  limit?: number;
}): DroneDto[] => {
  let query = `SELECT *
                 FROM drones
                 WHERE 1 = 1`;
  const params: (string | number)[] = [];

  if (state) {
    query += ` AND drone_state = ?`;
    params.push(state.toUpperCase());
  }

  if (batteryLevel !== undefined) {
    query += ` AND battery_capacity = ?`;
    params.push(Number(batteryLevel));
  }

  if (model) {
    query += ` AND model = ?`;
    params.push(model.toUpperCase());
  }

  if (serialNumber) {
    query += ` AND serial_number = ?`;
    params.push(serialNumber);
  }

  const offset = (page - 1) * limit;
  query += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const rows: Drone[] = db.prepare(query).all(...params) as Drone[];
  return rows.map(droneEntityMapper);
};

export const getTotalDronesCount = ({
  state,
  batteryLevel,
  model,
  serialNumber,
}: {
  state?: string;
  batteryLevel?: number;
  model?: string;
  serialNumber?: string;
}): number => {
  let query = `SELECT COUNT(*) as count
                 FROM drones
                 WHERE 1 = 1`;
  const params: (string | number)[] = [];

  if (state) {
    query += ` AND drone_state = ?`;
    params.push(state.toUpperCase());
  }

  if (batteryLevel !== undefined) {
    query += ` AND battery_capacity = ?`;
    params.push(Number(batteryLevel));
  }

  if (model) {
    query += ` AND model = ?`;
    params.push(model.toUpperCase());
  }

  if (serialNumber) {
    query += ` AND serial_number = ?`;
    params.push(serialNumber);
  }

  const result = db.prepare(query).get(...params) as { count: number };
  return result.count;
};

export const registerDrone = (registerDrone: DroneRegisterRequest) => {
  const id = uuidv4();
  const updatedRequest = { ...registerDrone, id: id, droneState: DroneState.Idle };
  db.prepare(
    `
            INSERT INTO drones (id, serial_number, model, weight_limit, battery_capacity, drone_state)
            VALUES (@id, @serialNumber, @model, @weightLimit, @batteryCapacity, @droneState)
        `,
  ).run(updatedRequest);
  return updatedRequest;
};

export const updateDroneState = (droneId: string, newState: DroneState): DroneDto | null => {
  const result = db
    .prepare(`UPDATE drones SET drone_state = ? WHERE id = ?`)
    .run(newState, droneId);

  if (result.changes === 0) {
    return null;
  }

  const row = db.prepare(`SELECT * FROM drones WHERE id = ?`).get(droneId) as Drone;
  return row ? droneEntityMapper(row) : null;
};

const insertWithTransaction = db.transaction(
  (droneId: string, newMedications: (Medication & { quantity?: number })[]) => {
    const stmt = db.prepare(`
            INSERT INTO drone_medications (drone_id, medication_id, quantity)
            VALUES (@droneId, @medicationId, @qty) ON CONFLICT(drone_id, medication_id)
      DO
            UPDATE SET quantity = quantity + excluded.quantity
        `);

    for (const med of newMedications) {
      stmt.run({
        droneId,
        medicationId: med.id,
        qty: med.quantity ?? 1,
      });
    }

    updateDroneState(droneId, DroneState.Loaded);
  },
);

export const loadMedications = async (
  droneSerialNumber: string,
  loadMedicationRequest: LoadingRequest,
) => {
  const droneResult = getDrones({ serialNumber: droneSerialNumber });
  if (!droneResult || droneResult.length === 0) {
    throw new ApiError(404, `Drone with ${droneSerialNumber} not found`);
  }
  const drone = droneResult[0];

  if (drone.batteryCapacity < Number(batteryLevelMinimum)) {
    throw new ApiError(
      422,
      `Battery level too low to load medications. Required level: ${batteryLevelMinimum}%`,
    );
  }

  const currentMedications = medicationService.getByDroneId(drone.id);
  const currentWeight = currentMedications.reduce((sum, m) => sum + m.weight * m.quantity, 0);

  const newMedications: (Medication & { quantity: number })[] = [];

  if (loadMedicationRequest.medicationIds) {
    for (const id of loadMedicationRequest.medicationIds) {
      const med = medicationService.getById(id);
      if (!med) throw new ApiError(404, `Medication ${id} not found`);
      newMedications.push({ ...med, quantity: 1 });
    }
  }

  if (loadMedicationRequest.medications) {
    for (const med of loadMedicationRequest.medications) {
      const created = medicationService.addMedication({
        weight: med.weight,
        code: med.code,
        image: med.image,
        name: med.name,
      });
      newMedications.push({ ...created, quantity: 1 });
    }
  }

  updateDroneState(drone.id, DroneState.Loading);

  const newWeight = newMedications.reduce((sum, m) => sum + m.weight * (m.quantity ?? 1), 0);
  const totalWeight = currentWeight + newWeight;

  if (totalWeight > drone.weightLimit) {
    throw new ApiError(
      400,
      `Weight limit exceeded: current=${currentWeight}, new=${newWeight}, limit=${drone.weightLimit}`,
    );
  }

  insertWithTransaction(drone.id, newMedications);

  return newMedications;
};
