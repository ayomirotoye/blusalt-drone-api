/**
 * @swagger
 * components:
 *   schemas:
 *     DroneModel:
 *       type: string
 *       enum:
 *         - Lightweight
 *         - Middleweight
 *         - Cruiserweight
 *         - Heavyweight
 */
export enum DroneModel {
  Lightweight = 'Lightweight',
  Middleweight = 'Middleweight',
  Cruiserweight = 'Cruiserweight',
  Heavyweight = 'Heavyweight',
}
