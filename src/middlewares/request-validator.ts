import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const doValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Something may be wrong with your request.',
      errors: errors.array(),
    });
  }
  next();
};
