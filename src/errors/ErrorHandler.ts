import { NextFunction, Request, Response } from 'express';
import { HttpError } from './types/HttpError';
import { ValidationError } from './types/ValidationError';

type ErrorTypes = Error | HttpError | ValidationError;

export const errorHandler = (error: ErrorTypes, req: Request, res: Response, next: NextFunction) => {
  const code = getCode(error);
  const message = getMessage(error);

  res.status(code).json({ code, message });
};

function getMessage(error: any) {
  return error.message || error;
}

function getCode(error: any) {
  const { code } = error;
  return isValidStatusCode(code) ? code : 400;
}

function isValidStatusCode(code: any) {
  return code && Number(code) > 99 && Number(code) < 600;
}
