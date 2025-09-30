import { Router } from 'express';
import {
  getAvailableDrones, getBatteryLevel,
  getDrones,
  loadMedications,
  registerDrone,
} from '../../controllers/drone-controller';
import { getMedicationsByDroneSerialNumber } from '../../controllers/medication-controller';
import { doValidation } from '../../middlewares/request-validator';
import { droneRegisterValidationRules } from '../../validators/drone-register-validator';
import {loadingRequestValidationRules} from "../../validators/drone-loading-validator";

const router = Router();

router.post('/', droneRegisterValidationRules, doValidation, registerDrone);
router.get('/', getDrones);
router.get('/available', getAvailableDrones);
router.get('/:droneSerialNumber/battery-level', getBatteryLevel);
router.get('/:droneSerialNumber/medications', getMedicationsByDroneSerialNumber);
router.put('/:droneSerialNumber/medications', loadingRequestValidationRules, doValidation, loadMedications);

export default router;
