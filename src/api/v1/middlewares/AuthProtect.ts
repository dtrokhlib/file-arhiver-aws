import { NextFunction, Response } from 'express';
import { TYPE } from '../../../constants/types';
import { RoutesProtector } from '../../../services/auth/RoutesProtector';
import { IRequest } from '../../../interfaces/api/IRequest';

export const AuthProtect = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const protector = req.container?.get<RoutesProtector>(TYPE.RoutesProtector);
    req.user = await protector?.isAuthenticated(req.headers.authorization);
    next();
  } catch (error) {
    next(error);
  }
};
