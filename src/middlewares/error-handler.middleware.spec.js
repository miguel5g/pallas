import { afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { ZodError } from 'zod';

import { ErrorHandlerMiddleware } from './error-handler.middleware';
import { TestRequest, TestResponse } from '../tests/helpers/express-mocks';
import { HttpError } from '../errors';

describe('middlewares/error-handler', () => {
  /** @type {ErrorHandlerMiddleware} */
  let middleware;
  /** @type {import('express').Request} */
  let request;
  /** @type {import('express').Response} */
  let response;
  /** @type {import('express').NextFunction} */
  let next;

  beforeAll(() => {
    middleware = new ErrorHandlerMiddleware();

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

  it('should return a custom response if error object is an instance of HttpError', async () => {
    const error = new HttpError('Custom message', 999);

    await middleware.handler(error, request, response, next);

    expect(response.status).toBeCalledWith(999);
    expect(response.json).toBeCalledWith({ message: 'Custom message' });
    expect(next).not.toBeCalled();
  });

  it('should return bad request response if error object is an instance of ZodError', async () => {
    const error = new ZodError([{ message: 'Custom', code: 'invalid_type', path: 'custom' }]);

    await middleware.handler(error, request, response, next);

    expect(response.status).toBeCalledWith(400);
    expect(response.json).toBeCalledWith({
      message: 'Invalid request body',
      errors: [
        {
          code: 'invalid_type',
          message: 'The "custom" field must be a string',
        },
      ],
    });
    expect(next).not.toBeCalled();
  });

  it('should return an internal server error response if any other error type', async () => {
    const error = new Error('Any other error');

    await middleware.handler(error, request, response, next);

    expect(response.status).toBeCalledWith(500);
    expect(response.json).toBeCalledWith({ message: 'Internal server error' });
    expect(next).not.toBeCalled();
  });
});
