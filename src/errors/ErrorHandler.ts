import { NextFunction, Request, Response } from 'express';
import { HttpError } from './types/HttpError';
import { ValidationError } from './types/ValidationError';

type ErrorTypes = Error | HttpError | ValidationError;

export const errorHandler = (error: ErrorTypes, req: Request, res: Response, next: NextFunction) => {
  const code = getCode(error);
  const message = getMessage(error);

  res.status(code).send({ code, message });
};

function getMessage(error: any) {
  return error.message || error;
}

function getCode(error: any) {
  return error.code || 500;
}
