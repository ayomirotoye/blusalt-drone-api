import { Medication } from '../models/medication';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';
import { MedicationRequest } from '../models/dtos/medication-request';

export const getById = (medicationId: string) => {
  return db
    .prepare(
      `
        SELECT id, name, weight, code, image
        FROM medications
        WHERE id = ?
    `,
    )
    .get(medicationId) as Medication;
};

export const getByDroneSerialNumber = (droneSerialNumber: string) => {
  const rows = db
    .prepare(
      `
        SELECT m.id, m.name, m.weight, m.code, m.image
        FROM medications m
                 JOIN drone_medications dm ON m.id = dm.medication_id
                 JOIN drones d ON dm.drone_id = d.id
        WHERE d.serial_number = ?
    `,
    )
    .all(droneSerialNumber);

  return rows as Medication[];
};

export const getByDroneId = (droneId: string) => {
  const rows = db
    .prepare(
      `SELECT m.*, dm.quantity
         FROM drone_medications dm
                  JOIN medications m ON m.id = dm.medication_id
         WHERE dm.drone_id = ?`,
    )
    .all(droneId);

  return rows as (Medication & { quantity: number })[];
};

export const addMedication = (medication: MedicationRequest): Medication => {
  const existing = db
    .prepare(
      `SELECT *
                                 FROM medications
                                 WHERE code = ?`,
    )
    .get(medication.code);

  if (existing) {
    return existing as Medication;
  }

  const id = uuidv4();
  const savedMedication: Medication = {
    id,
    name: medication.name,
    weight: medication.weight,
    code: medication.code,
    image: medication.image,
  };

  db.prepare(
    `INSERT INTO medications (id, name, weight, code, image)
         VALUES (@id, @name, @weight, @code, @image)`,
  ).run(savedMedication);

  return savedMedication;
};
