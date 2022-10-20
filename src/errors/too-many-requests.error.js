import { HttpError } from './http-error';

class TooManyRequestsError extends HttpError {
  constructor() {
    super('Too many requests', 429);
  }
}

export { TooManyRequestsError };
