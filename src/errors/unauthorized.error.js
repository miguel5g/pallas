import { HttpError } from './http-error';

class UnauthorizedError extends HttpError {
  constructor(message) {
    super(message || 'Unauthorized', 401);
  }
}

export { UnauthorizedError };
