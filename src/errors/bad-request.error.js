import { HttpError } from './http-error';
import { statusCodes } from './status-codes';

class BadRequestError extends HttpError {
  constructor(message) {
    super(message || 'Bad request', statusCodes.BAD_REQUEST);
  }
}

export { BadRequestError };
