import { z } from 'zod';

import { HttpError } from '../errors';
import { parserMessage } from '../validators';

class ErrorHandlerMiddleware {
  constructor() {
    this.handler = this.handler.bind(this);
  }

  /**
   * @param {unknown} error
   * @param {import('express').Request} _request
   * @param {import('express').Response} response
   * @param {import('express').NextFunction} _next
   * @returns {Promise<void>}
   */
  handler(error, _request, response, _next) {
    if (error instanceof HttpError) {
      return response.status(error.statusCode).json({ message: error.message });
    }

    if (error instanceof z.ZodError) {
      return response.status(400).json({
        message: 'Invalid request body',
        errors: error.issues.map((issue) => parserMessage(issue)),
      });
    }

    return response.status(500).json({ message: 'Internal server error' });
  }
}

export { ErrorHandlerMiddleware };
