import { HttpError } from './http-error';
import { statusCodes } from './status-codes';

class InternalServerError extends HttpError {
  constructor() {
    super('Internal server error', statusCodes.INTERNAL_ERROR);
  }
}

export { InternalServerError };
