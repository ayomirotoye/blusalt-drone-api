import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import v1DroneApiRouter from './routes/v1/drone-routes';
import { errorHandler } from './middlewares/error-handler';
import { notFoundHandler } from './middlewares/not-found-handler';
import router from "./routes/v1/drone-routes";

dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Middleware for JSON
app.use(express.json());

// Routes
router.get('/', (_req: Request, res: Response) => {
  res.send("<h2>Welcome to Blusalt Drone Service</h2>");
});

app.use('/api/v1/drones', v1DroneApiRouter);

app.use(notFoundHandler);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

export default app;