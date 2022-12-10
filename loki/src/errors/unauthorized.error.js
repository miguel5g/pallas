import { HttpError } from './http-error';
import { StatusCodes } from './status-codes';

class UnauthorizedError extends HttpError {
  constructor(message) {
    super(message || 'Unauthorized', StatusCodes.NOT_AUTHORIZED);
  }
}

export { UnauthorizedError };
