import {Request} from 'express';
import {Drone} from "../models/drone";
import {LoadingRequest} from "../models/requests/loading-request";

export async function getAvailableDrones() {
    return []
}

export const getDrones = async (req: Request) => {
    const {state, batteryLevel, model} = req.query;
    let result: Drone[] = []
    // Filter by state
    if (state) {
        result = result.filter(
            (d) => d.droneState === state.toString().toUpperCase(),
        );
    }

    if (batteryLevel) {
        const level = Number(batteryLevel);
        if (!isNaN(level)) {
            result = result.filter((d) => d.batteryCapacity === level);
        }
    }

    if (model) {
        result = result.filter(
            (d) => d.model === model.toString().toUpperCase(),
        );
    }

    return result;
}

export const registerDrone  = async (registerDrone: Drone) => {
    return {

    }
}

export const getDroneBySerialNumber = async (serialNumber: string) => {
    return {
        serialNumber: serialNumber,
    }
}

export const loadMedications  = async (loadMedicationRequest: LoadingRequest[]) => {
    return {

    }
}

