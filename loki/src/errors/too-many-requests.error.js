import { HttpError } from './http-error';
import { StatusCodes } from './status-codes';

class TooManyRequestsError extends HttpError {
  constructor() {
    super('Too many requests', StatusCodes.TOO_MANY_REQUESTS);
  }
}

export { TooManyRequestsError };
