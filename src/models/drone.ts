import {DroneModel} from "../enums/drone-model";
import {DroneState} from "../enums/drone-state";

export interface Drone {
    id: string;
    serialNumber: string;
    model: DroneModel;
    weightLimit: number,
    batteryCapacity: number;
    droneState: DroneState;
}