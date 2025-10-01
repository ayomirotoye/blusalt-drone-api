import { DroneModel } from '../../enums/drone-model';

/**
 * @swagger
 * components:
 *   schemas:
 *     DroneRegisterRequest:
 *       type: object
 *       required:
 *         - serialNumber
 *         - model
 *         - weightLimit
 *         - batteryCapacity
 *       properties:
 *         serialNumber:
 *           type: string
 *           description: The serial number of the drone
 *           example: "DRN-001"
 *         model:
 *           $ref: '#/components/schemas/DroneModel'
 *         weightLimit:
 *           type: number
 *           description: The weight limit of the drone
 *           example: 100
 *         batteryCapacity:
 *           type: number
 *           description: The battery capacity of the drone
 *           example: 100
 */
export interface DroneRegisterRequest {
  serialNumber: string;
  model: DroneModel;
  weightLimit: number;
  batteryCapacity: number;
}
