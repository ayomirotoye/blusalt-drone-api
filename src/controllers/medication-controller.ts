import { NextFunction, Request, Response } from 'express';
import * as medicationService from '../services/medication-service';

export const getMedicationsByDroneSerialNumber = async (
  { params: { droneSerialNumber }, query: { page, limit } }: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 10;

    const medications = medicationService.getByDroneSerialNumber(
      droneSerialNumber,
      pageNumber,
      limitNumber,
    );
    const total = medicationService.getTotalMedicationsByDroneSerialNumberCount(droneSerialNumber);

    res.json({
      success: true,
      data: medications,
      meta: { total, page: pageNumber, limit: limitNumber },
    });
  } catch (error) {
    next(error);
  }
};
