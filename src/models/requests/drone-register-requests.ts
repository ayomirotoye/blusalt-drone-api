import {DroneModel} from "../../enums/drone-model";

export interface DroneRegisterRequest {
    serialNumber: string;
    model: DroneModel;
    weightLimit: number;
    batteryCapacity: number;
}
