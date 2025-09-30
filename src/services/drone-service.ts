import {Request} from 'express';
import {Drone} from '../models/drone';
import {LoadingRequest} from '../models/requests/loading-request';
import db from "../db";
import {v4 as uuidv4} from 'uuid';

export async function getAvailableDrones() {
    return [];
}

export const getDrones = async (req: Request) => {
    const {state, batteryLevel, model} = req.query;
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

export const loadMedications = async (loadMedicationRequest: LoadingRequest[]) => {
    return {};
};
