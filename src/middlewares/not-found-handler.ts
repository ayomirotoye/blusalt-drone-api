import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new ApiError(404, `Cannot ${req.method} ${req.originalUrl}`));
};
