import { HttpError } from './http-error';
import { StatusCodes } from './status-codes';

class NotFoundError extends HttpError {
  constructor(resource) {
    super(`${resource} not found`, StatusCodes.NOT_FOUND);
  }
}

export { NotFoundError };
