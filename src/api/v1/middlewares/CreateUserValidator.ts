import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '../../../models/CreateUserDto';
import { ValidationError } from '../../../errors/types/ValidationError';

export const CreateUserValidator = async (req: Request, res: Response, next: NextFunction) => {
  const user = plainToClass(CreateUserDto, req.body);
  const errors = await validate(user);

  if (errors.length) {
    return next(new ValidationError(errors.toString()));
  }

  return next();
};
