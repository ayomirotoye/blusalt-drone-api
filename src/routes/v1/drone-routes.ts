import { Router } from 'express';
import {
  getAvailableDrones,
  getBatteryLevel,
  getDrones,
  loadMedications,
  registerDrone,
} from '../../controllers/drone-controller';
import { getMedicationsByDroneSerialNumber } from '../../controllers/medication-controller';
import { doValidation } from '../../middlewares/request-validator';
import { droneRegisterValidationRules } from '../../validators/drone-register-validator';
import { loadingRequestValidationRules } from '../../validators/drone-loading-validator';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Drones
 *   description: Drone management
 */

/**
 * @swagger
 * /api/v1/drones:
 *   post:
 *     summary: Register a new drone
 *     tags: [Drones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DroneRegisterRequest'
 *           example:
 *             serialNumber: "DRN-001"
 *             model: "Lightweight"
 *             weightLimit: 100
 *             batteryCapacity: 100
 *     responses:
 *       201:
 *         description: The drone was successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Drone'
 *       400:
 *         description: Bad request
 */
router.post('/', droneRegisterValidationRules, doValidation, registerDrone);

/**
 * @swagger
 * /api/v1/drones:
 *   get:
 *     summary: Get all drones
 *     tags: [Drones]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A paginated list of drones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Drone'
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 */
router.get('/', getDrones);

/**
 * @swagger
 * /api/v1/drones/available:
 *   get:
 *     summary: Get all available drones for loading
 *     tags: [Drones]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A paginated list of available drones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Drone'
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 */
router.get('/available', getAvailableDrones);

/**
 * @swagger
 * /api/v1/drones/{droneSerialNumber}/battery-level:
 *   get:
 *     summary: Get the battery level of a drone
 *     tags: [Drones]
 *     parameters:
 *       - in: path
 *         name: droneSerialNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The drone serial number
 *     responses:
 *       200:
 *         description: The drone battery level
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 batteryLevel:
 *                   type: number
 *       404:
 *         description: The drone was not found
 */
router.get('/:droneSerialNumber/battery-level', getBatteryLevel);

/**
 * @swagger
 * /api/v1/drones/{droneSerialNumber}/medications:
 *   get:
 *     summary: Get the medications loaded on a drone
 *     tags: [Drones]
 *     parameters:
 *       - in: path
 *         name: droneSerialNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The drone serial number
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A paginated list of medications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Medication'
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       404:
 *         description: The drone was not found
 */
router.get('/:droneSerialNumber/medications', getMedicationsByDroneSerialNumber);

/**
 * @swagger
 * /api/v1/drones/{droneSerialNumber}/medications:
 *   put:
 *     summary: Load medications onto a drone
 *     tags: [Drones]
 *     parameters:
 *       - in: path
 *         name: droneSerialNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The drone serial number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoadingRequest'
 *           example:
 *             medicationIds: ["c6a8a9b5-7c9b-4a3e-9f2a-5e2b2c1a3e5d"]
 *     responses:
 *       200:
 *         description: The medications were successfully loaded
 *       400:
 *         description: Bad request
 *       404:
 *         description: The drone was not found
 */
router.put(
  '/:droneSerialNumber/medications',
  loadingRequestValidationRules,
  doValidation,
  loadMedications,
);

export default router;
