import { HttpError } from './http-error';
import { statusCodes } from './status-codes';

class NotImplementedError extends HttpError {
  constructor() {
    super('Not implemented', statusCodes.NOT_IMPLEMENTED);
  }
}

export { NotImplementedError };
