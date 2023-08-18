import { NextFunction, Response } from 'express';
import { TYPE } from '../../../constants/types';
import { IRequest } from '../../../interfaces/api/IRequest';
import { RoutesProtector } from '../../../services/auth/RoutesProtector';

export const addUserToRequest = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const protector = req.container?.get<RoutesProtector>(TYPE.RoutesProtector);
    req.user = await protector?.getUserByToken(req.headers.authorization);
    next();
  } catch (error) {
    next(error);
  }
};
