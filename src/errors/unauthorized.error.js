import { HttpError } from './http-error';

class UnauthorizedError extends HttpError {
  constructor() {
    super('Unauthorized', 401);
  }
}

export { UnauthorizedError };
