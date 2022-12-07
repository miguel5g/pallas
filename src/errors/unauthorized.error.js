import { HttpError } from './http-error';
import { statusCodes } from './status-codes';

class UnauthorizedError extends HttpError {
  constructor(message) {
    super(message || 'Unauthorized', statusCodes.NOT_AUTHORIZED);
  }
}

export { UnauthorizedError };
