import { HttpError } from './http-error';
import { StatusCodes } from './status-codes';

class BadRequestError extends HttpError {
  constructor(message) {
    super(message || 'Bad request', StatusCodes.BAD_REQUEST);
  }
}

export { BadRequestError };
