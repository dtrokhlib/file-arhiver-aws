import { NextFunction, Request, Response } from 'express';

const currentDate = () => {
  const date = new Date();
  return date.toLocaleString();
};

export const RequestLogger = async (req: Request, res: Response, next: NextFunction) => {
  const message = `${currentDate()} -> [${req.method}] ${req.url}`;
  console.log(message);

  return next();
};
