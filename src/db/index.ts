import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.resolve(__dirname, '../../drone.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS drones (
    id STRING PRIMARY KEY,
    serial_number TEXT NOT NULL UNIQUE,
    model TEXT NOT NULL,
    weight_limit INTEGER NOT NULL CHECK (weight_limit <= 500),
    battery_capacity INTEGER NOT NULL CHECK (battery_capacity >= 0 AND battery_capacity <= 100),
    drone_state TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS medications (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     weight INTEGER NOT NULL,
     code TEXT NOT NULL UNIQUE,
     image TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS drone_medications (
    drone_id TEXT NOT NULL,
    medication_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (drone_id, medication_id),
    FOREIGN KEY (drone_id) REFERENCES drones(id) ON DELETE CASCADE,
    FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE CASCADE
  );
`);

export default db;
