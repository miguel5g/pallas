import { HttpError } from './http-error';

class InternalServerError extends HttpError {
  constructor() {
    super('Internal server error', 500);
  }
}

export { InternalServerError };
