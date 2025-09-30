import { DroneModel } from '../enums/drone-model';
import { DroneState } from '../enums/drone-state';

export interface Drone {
  id: string;
  serialNumber: string;
  model: DroneModel;
  weightLimit: number;
  batteryCapacity: number;
  droneState: DroneState;
}

export const droneEntityMapper = (row: any): Drone => {
  return {
    id: row.id,
    serialNumber: row.serial_number,
    model: row.model as DroneModel,
    weightLimit: row.weight_limit,
    batteryCapacity: row.battery_capacity,
    droneState: row.drone_state as DroneState,
  };
};