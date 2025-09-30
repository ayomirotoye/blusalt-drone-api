import { Request, Response, NextFunction } from 'express';
import * as droneService from '../services/drone-service';

export const registerDrone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const registerResult = await droneService.registerDrone(req.body);
    res.status(201).json({ success: true, data: registerResult });
  } catch (error) {
    next(error);
  }
};

export const getDrones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dronesResult = await droneService.getDrones(req);
    res.json({ success: true, data: dronesResult });
  } catch (error) {
    next(error);
  }
};

export const getAvailableDrones = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const availableDrones = await droneService.getAvailableDrones();
    res.json({ success: true, data: availableDrones });
  } catch (error) {
    next(error);
  }
};

export const loadMedications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loadingResult = await droneService.loadMedications(req.body);
    res.json({ success: true, data: loadingResult });
  } catch (error) {
    next(error);
  }
};
