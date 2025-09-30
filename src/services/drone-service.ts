import {Drone} from '../models/drone';
import {LoadingRequest} from '../models/requests/loading-request';
import db from "../db";
import {v4 as uuidv4} from 'uuid';
import {ApiError} from "../utils/api-error";
import * as medicationService from '../services/medication-service';
import {Medication} from "../models/medication";

export async function getAvailableDrones() {
    return [];
}

export const getDrones = async (
    {
        state,
        batteryLevel,
        model,
        serialNumber
    }: {
        state?: string,
        batteryLevel?: number,
        model?: string,
        serialNumber?: string,
    }
) => {
    let result: Drone[] = [];

    if (state) {
        result = result.filter((d) => d.droneState === state.toString().toUpperCase());
    }

    if (batteryLevel) {
        const level = Number(batteryLevel);
        if (!isNaN(level)) {
            result = result.filter((d) => d.batteryCapacity === level);
        }
    }

    if (model) {
        result = result.filter((d) => d.model === model.toString().toUpperCase());
    }

    if (serialNumber) {
        result = result.filter((d) => d.serialNumber === serialNumber);
    }

    return result;
};

export const registerDrone = (registerDrone: Drone) => {
    const id = uuidv4();
    const updatedRequest = {...registerDrone, id: id}
    db.prepare(`
        INSERT INTO drones (id, serial_number, model, weight_limit, battery_capacity, drone_state)
        VALUES (@id, @serialNumber, @model, @weightLimit, @batteryCapacity, @droneState)
    `).run(updatedRequest);
    return updatedRequest;
};

export const getDroneBySerialNumber = async (serialNumber: string) => {
    return {
        serialNumber: serialNumber,
    };
};

export const loadMedications = async (
    droneSerialNumber: string,
    loadMedicationRequest: LoadingRequest[]
) => {
    const droneResult = await getDrones({serialNumber: droneSerialNumber});
    if (!droneResult || droneResult.length === 0) {
        throw new ApiError(404, `Drone with ${droneSerialNumber} not found`);
    }
    const drone = droneResult[0]
    const currentMedications = await medicationService.getByDroneId(drone.id);
    const currentWeight = currentMedications.reduce((sum, m) => sum + m.weight, 0);

    const newMedicationIds: string[] = [];
    const newMedications: Medication[] = [];

    for (const req of loadMedicationRequest) {
        if (req.medicationIds) {
            for (const id of req.medicationIds) {
                const med = medicationService.getById(id);
                if (!med) throw new ApiError(404, `Medication ${id} not found`);
                newMedications.push(med);
                newMedicationIds.push(id);
            }
        }

        if (req.medications) {
            for (const med of req.medications) {
                const created = medicationService.addMedication({
                    weight: 0,
                    code: '',
                    image: '',
                    name: ''
                });
                newMedications.push(created);
                newMedicationIds.push(created.id);
            }
        }
    }

    // 4. Check weight constraint
    const newWeight = newMedications.reduce((sum, m) => sum + m.weight, 0);
    const totalWeight = currentWeight + newWeight;

    if (totalWeight > drone.weightLimit) {
        throw new ApiError(
            400,
            `Weight limit exceeded: current=${currentWeight}, new=${newWeight}, limit=${drone.weightLimit}`
        );
    }

    for (const id of newMedicationIds) {
        medicationService.addToDrone(id, drone.id);
    }

    return newMedicationIds;
};
