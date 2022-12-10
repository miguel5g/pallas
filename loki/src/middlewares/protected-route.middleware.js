import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { UnauthorizedError } from '../errors';
import { decode } from '../libs/token';

class ProtectedRouteMiddleware {
  constructor() {
    this.handler = this.handler.bind(this);
  }

  /**
   * @param {import('express').Request} request
   * @param {import('express').Response} _response
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  handler(request, _response, next) {
    const { token } = request.cookies;

    if (!token) throw new UnauthorizedError('Invalid token');

    try {
      const payload = decode(token);

      request.user = payload;

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedError('Your token has expired');
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedError('Your token is invalid');
      }

      throw error;
    }
  }
}

export { ProtectedRouteMiddleware };
