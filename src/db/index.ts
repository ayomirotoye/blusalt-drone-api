import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.resolve(__dirname, '../../drone.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS drones (
    id STRING PRIMARY KEY,
    serialNumber TEXT NOT NULL,
    model TEXT NOT NULL,
    weightLimit INTEGER NOT NULL CHECK (weightLimit <= 500),
    batteryCapacity INTEGER NOT NULL CHECK (batteryCapacity >= 0 AND batteryCapacity <= 100),
    droneState TEXT NOT NULL
  )
`);

export default db;
