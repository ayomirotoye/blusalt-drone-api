import db from "../db";
import {Drone} from "../models/drone";
import {v4 as uuidv4} from "uuid";

export const auditDroneBatteries = () => {
    const drones = db.prepare(`SELECT * FROM drones`).all() as Drone[];

    if (drones.length > 0) {
        for (const drone of drones) {
            const id = uuidv4();
            db.prepare(
                `INSERT INTO battery_audit_logs (id, drone_id, battery_level, created_at)
                 VALUES (?, ?, ?)`
            ).run(id, drone.id, drone.batteryCapacity, new Date().toISOString());
        }

        console.log(`[DroneBatteryAuditJob] Logged ${drones.length} entries`);
    } else {
        console.log(`[DroneBatteryAuditJob]: No drone information found at ${new Date().toISOString()}  `);
    }


};