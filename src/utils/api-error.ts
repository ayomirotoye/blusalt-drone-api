export class ApiError extends Error {
  public statusCode: number;
  public errors: string[];

  constructor(statusCode: number, message: string, errors: string[] = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
