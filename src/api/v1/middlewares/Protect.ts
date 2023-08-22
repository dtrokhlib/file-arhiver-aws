import { NextFunction, Response } from 'express';
import { IRequest } from '../../../interfaces/api/IRequest';
import { HttpError } from '../../../errors/types/HttpError';

export const Protect = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new HttpError('Unauthorized', 401);
    }
    next();
  } catch (error) {
    next(error);
  }
};
