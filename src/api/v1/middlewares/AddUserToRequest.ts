import { NextFunction, Response } from 'express';
import { TYPE } from '../../../constants/types';
import { IRequest } from '../../../interfaces/api/IRequest';
import { AuthMiddlewares } from '../../../services/auth/AuthMiddlewares';

export const addUserToRequest = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const authMiddlewares = req.container?.get<AuthMiddlewares>(TYPE.AuthMiddlewares);
    req.user = await authMiddlewares?.getUserByToken(req.headers.authorization);
    next();
  } catch (error) {
    next();
  }
};
