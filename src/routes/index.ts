import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.send("<h2>Welcome to Blusalt Drone Service</h2>");
});

export default router;
