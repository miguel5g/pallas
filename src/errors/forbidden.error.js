import { HttpError } from './http-error';
import { StatusCodes } from './status-codes';

class ForbiddenError extends HttpError {
  constructor(message) {
    super(message || 'Forbidden', StatusCodes.FORBIDDEN);
  }
}

export { ForbiddenError };
