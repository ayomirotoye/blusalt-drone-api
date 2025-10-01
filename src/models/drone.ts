import { DroneModel } from '../enums/drone-model';
import { DroneState } from '../enums/drone-state';
import { DroneDto } from './dtos/drone-dto';

export interface Drone {
  id: string;
  serial_number: string;
  model: string;
  weight_limit: number;
  battery_capacity: number;
  drone_state: string;
}

export const droneEntityMapper = (row: Drone): DroneDto => {
  return {
    id: row.id,
    serialNumber: row.serial_number,
    model: row.model as DroneModel,
    weightLimit: row.weight_limit,
    batteryCapacity: row.battery_capacity,
    droneState: row.drone_state as DroneState,
  };
};
