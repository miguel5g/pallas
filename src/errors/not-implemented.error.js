import { HttpError } from './http-error';
import { StatusCodes } from './status-codes';

class NotImplementedError extends HttpError {
  constructor() {
    super('Not implemented', StatusCodes.NOT_IMPLEMENTED);
  }
}

export { NotImplementedError };
