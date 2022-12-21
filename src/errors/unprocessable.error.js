import { HttpError } from './http-error';
import { StatusCodes } from './status-codes';

class UnprocessableError extends HttpError {
  /**
   * @param {string | undefined} message
   */
  constructor(message) {
    super(message || 'Unprocessable entity', StatusCodes.UNPROCESSABLE);
  }
}

export { UnprocessableError };
