import { body } from 'express-validator';
import { DroneModel } from '../enums/drone-model';

export const droneRegisterValidationRules = [
  body('serialNumber')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Serial number must not exceed 100 chars'),

  body('model')
    .isIn(Object.values(DroneModel))
    .withMessage('Invalid drone model. Allowed models are : ' + Object.values(DroneModel)),

  body('weightLimit')
    .isInt({ min: 1, max: 500 })
    .withMessage('Weight limit must be between 1 and 500'),

  body('batteryCapacity')
    .isInt({ min: 0, max: 100 })
    .withMessage('Battery capacity must be between 0 and 100'),
];