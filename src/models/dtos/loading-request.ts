import { MedicationRequest } from './medication-request';

/**
 * @swagger
 * components:
 *   schemas:
 *     LoadingRequest:
 *       type: object
 *       properties:
 *         medicationIds:
 *           type: array
 *           items:
 *             type: string
 *           description: The IDs of the medications to load
 *           example: ["c6a8a9b5-7c9b-4a3e-9f2a-5e2b2c1a3e5d"]
 *         medications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MedicationRequest'
 *           description: The medications to load
 */
export interface LoadingRequest {
  medicationIds?: string[];
  medications?: MedicationRequest[];
}
