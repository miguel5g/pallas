import { HttpError } from './http-error';
import { statusCodes } from './status-codes';

class NotFoundError extends HttpError {
  constructor(resource) {
    super(`${resource} not found`, statusCodes.NOT_FOUND);
  }
}

export { NotFoundError };
