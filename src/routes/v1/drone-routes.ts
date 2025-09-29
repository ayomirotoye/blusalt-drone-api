import {Router} from 'express';
import {getAvailableDrones, getDrones, loadMedications, registerDrone} from "../../controllers/drone-controller";
import {getMedicationsByDroneSerialNumber} from "../../controllers/medication-controller";

const router = Router();

router.post('/', registerDrone);
router.get('/', getDrones);
router.get('/available', getAvailableDrones);
router.get('/:droneSerialNumber/medications', getMedicationsByDroneSerialNumber);
router.put('/:droneSerialNumber', loadMedications);

export default router;
