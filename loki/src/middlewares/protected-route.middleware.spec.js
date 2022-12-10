import { afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import '../tests/helpers/token-mock';
import * as token from '../libs/token';
import { ProtectedRouteMiddleware } from './protected-route.middleware';
import { TestRequest, TestResponse } from '../tests/helpers/express-mocks';
import { UnauthorizedError } from '../errors';

describe('middlewares/protected-route', () => {
  /** @type {ProtectedRouteMiddleware} */
  let middleware;
  /** @type {import('express').Request} */
  let request;
  /** @type {import('express').Response} */
  let response;
  /** @type {import('express').NextFunction} */
  let next;

  beforeAll(() => {
    middleware = new ProtectedRouteMiddleware();

    request = new TestRequest();
    response = new TestResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(middleware.handler).toBeDefined();
  });

  it('should throw unauthorized error when user does not send token', () => {
    expect.assertions(2);

    try {
      middleware.handler(request, response);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect(error.message).toBe('Invalid token');
    }
  });

  it('should throw unauthorized error when user token is expired', () => {
    expect.assertions(3);

    request.cookies = { token: 'any' };

    token.decode.mockImplementation(() => {
      throw new TokenExpiredError('Error', new Date());
    });

    try {
      middleware.handler(request, response);
    } catch (error) {
      expect(token.decode).toBeCalledWith('any');
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect(error.message).toBe('Your token has expired');
    }
  });

  it('should throw unauthorized error when user token is invalid', () => {
    expect.assertions(3);

    request.cookies = { token: 'any' };

    token.decode.mockImplementation(() => {
      throw new JsonWebTokenError('Error');
    });

    try {
      middleware.handler(request, response);
    } catch (error) {
      expect(token.decode).toBeCalledWith('any');
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect(error.message).toBe('Your token is invalid');
    }
  });

  it('should throw original error it is unknown', () => {
    expect.assertions(2);

    const error = new Error('Unknown error');
    request.cookies = { token: 'any' };

    token.decode.mockImplementation(() => {
      throw error;
    });

    try {
      middleware.handler(request, response);
    } catch (error) {
      expect(token.decode).toBeCalledWith('any');
      expect(error).toBe(error);
    }
  });
});
