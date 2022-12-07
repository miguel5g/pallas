import { HttpError } from './http-error';
import { statusCodes } from './status-codes';

class TooManyRequestsError extends HttpError {
  constructor() {
    super('Too many requests', statusCodes.TOO_MANY_REQUESTS);
  }
}

export { TooManyRequestsError };
