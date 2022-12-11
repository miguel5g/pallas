import { HttpError } from './http-error';
import { StatusCodes } from './status-codes';

class InternalServerError extends HttpError {
  constructor() {
    super('Internal server error', StatusCodes.INTERNAL_ERROR);
  }
}

export { InternalServerError };
