export class HttpError extends Error {
  protected code: number;

  constructor(message: any, code = 500) {
    super(message);
    this.code = code;
  }
}
