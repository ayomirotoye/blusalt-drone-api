import express from 'express';
import dotenv from 'dotenv';
import rootRouter from './routes';
import { errorHandler } from './middlewares/error-handler';
import { notFoundHandler } from './middlewares/not-found-handler';

dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Middleware for JSON
app.use(express.json());

// Routes
app.use('/', rootRouter);

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(PORT, (): void => {
  console.log(`🚀 API is running on http://localhost:${PORT}`);
});
