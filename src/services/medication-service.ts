import {Medication} from "../models/medication";
import db from "../db";
import {v4 as uuidv4} from "uuid";
import {MedicationRequest} from "../models/requests/medication-request";

export const getById = (medicationId: string) => {
  return db.prepare(`
        SELECT id, name, weight, code, image
        FROM medications
        WHERE id = ?
    `).get(medicationId) as Medication;
};

export const getByDroneSerialNumber = (droneSerialNumber: string) => {
  const rows = db.prepare(`
        SELECT m.id, m.name, m.weight, m.code, m.image
        FROM medications m
        JOIN drone_medications dm ON m.id = dm.medication_id
        JOIN drones d ON dm.drone_id = d.id
        WHERE d.serial_number = ?
    `).all(droneSerialNumber);

  return rows as Medication[];
};

export const getByDroneId =  (droneId: string) => {
  const rows = db.prepare(`
    SELECT m.id, m.name, m.weight, m.code, m.image
    FROM medications m
    JOIN drone_medications dm ON m.id = dm.medication_id
    JOIN drones d ON dm.drone_id = d.id
    WHERE d.id = ?
  `).all(droneId);

  return rows as Medication[];
};

export const addMedication =  (medication: MedicationRequest) => {
  const id = uuidv4();
  const updatedRequest = {...medication, id: id}
  db.prepare(`
        INSERT INTO medications (id, name, weight, code, image)
        VALUES (@id, @name, @weight, @code, @image)
    `).run(updatedRequest);
};

export const addToDrone =  (medicationId: string, droneId: string) => {
  db.prepare(
      `INSERT OR IGNORE INTO drone_medications (drone_id, medication_id) VALUES (@droneId, @medicationId)`
  ).run(droneId, medicationId);
};