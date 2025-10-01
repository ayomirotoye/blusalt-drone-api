import { DroneModel } from '../../enums/drone-model';
import { DroneState } from '../../enums/drone-state';

/**
 * @swagger
 * components:
 *   schemas:
 *     Drone:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the drone
 *         serialNumber:
 *           type: string
 *           description: The serial number of the drone
 *         model:
 *           $ref: '#/components/schemas/DroneModel'
 *         weightLimit:
 *           type: number
 *           description: The weight limit of the drone
 *         batteryCapacity:
 *           type: number
 *           description: The battery capacity of the drone
 *         droneState:
 *           $ref: '#/components/schemas/DroneState'
 */
export interface DroneDto {
  id: string;
  serialNumber: string;
  model: DroneModel;
  weightLimit: number;
  batteryCapacity: number;
  droneState: DroneState;
}
