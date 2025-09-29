import {NextFunction, Request, Response} from "express";
import * as medicationService from "../services/medication-service";

export const getMedicationsByDroneSerialNumber =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const medications = await medicationService.getMedicationsByDroneSerialNumber(
                req.params.droneSerialNumber
            );
            res.json({success: true, data: medications});
        } catch (error) {
            next(error);
        }
    }