import { HttpError } from './http-error';

class NotImplementedError extends HttpError {
  constructor() {
    super('Not implemented', 501);
  }
}

export { NotImplementedError };
