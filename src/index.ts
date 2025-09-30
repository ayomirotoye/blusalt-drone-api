import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import cron from 'node-cron';
import v1DroneApiRouter from './routes/v1/drone-routes';
import {errorHandler} from './middlewares/error-handler';
import {notFoundHandler} from './middlewares/not-found-handler';
import router from './routes/v1/drone-routes';
import {seedMedications} from "./data/seed-medications";
import {auditDroneBatteries} from "./services/battery-level-audit-service";

dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;
const DRONE_BATTERY_AUDIT_CRON = process.env.DRONE_BATTERY_AUDIT_CRON ?? '*/5 * * * *';

app.use(express.json());

router.get('/', (_req: Request, res: Response) => {
    res.send('<h2>Welcome to Blusalt Drone Service</h2>');
});

app.use('/api/v1/drones', v1DroneApiRouter);

app.use(notFoundHandler);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
    seedMedications() // seeding medications for Proof of Concept (PoC) use case
    cron.schedule(DRONE_BATTERY_AUDIT_CRON, () => {
        console.log('[DroneBatteryAuditJob] Running...');
        auditDroneBatteries();
    });
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}

export default app;
