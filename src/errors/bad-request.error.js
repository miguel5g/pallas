import { HttpError } from './http-error';

class BadRequestError extends HttpError {
  constructor() {
    super('Bad request', 400);
  }
}

export { BadRequestError };
