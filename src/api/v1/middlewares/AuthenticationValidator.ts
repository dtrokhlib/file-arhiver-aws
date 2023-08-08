import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../../../errors/types/ValidationError';
import { AuthenticationDto } from '../../../models/AuthenticationDto';

export const AuthenticationValidator = async (req: Request, res: Response, next: NextFunction) => {
  const auth = plainToClass(AuthenticationDto, req.body);
  const errors = await validate(auth);

  if (errors.length) {
    return next(new ValidationError(errors.toString()));
  }

  return next();
};
