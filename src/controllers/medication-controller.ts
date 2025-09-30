import { NextFunction, Request, Response } from 'express';
import * as medicationService from '../services/medication-service';

export const getMedicationsByDroneSerialNumber = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log('getMedicationsByDroneSerialNumber::'+req.params.droneSerialNumber);
    const medications = medicationService.getByDroneSerialNumber(req.params.droneSerialNumber,);
    res.json({ success: true, data: medications });
  } catch (error) {
    next(error);
  }
};
