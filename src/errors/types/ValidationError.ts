import { HttpError } from './HttpError';

export class ValidationError extends HttpError {
  constructor(message: string, code = 422) {
    super(message, code);
  }
}
