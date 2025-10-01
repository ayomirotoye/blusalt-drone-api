/**
 * @swagger
 * components:
 *   schemas:
 *     DroneState:
 *       type: string
 *       enum:
 *         - IDLE
 *         - LOADING
 *         - LOADED
 *         - DELIVERING
 *         - DELIVERED
 *         - RETURNING
 */
export enum DroneState {
  Idle = 'IDLE',
  Loading = 'LOADING',
  Loaded = 'LOADED',
  Delivering = 'DELIVERING',
  Delivered = 'DELIVERED',
  Returning = 'RETURNING',
}
