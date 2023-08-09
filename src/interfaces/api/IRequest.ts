import { Request } from 'express';
import { Container } from 'inversify';

export interface IRequest extends Request {
  container?: Container;
  user?: any;
}
