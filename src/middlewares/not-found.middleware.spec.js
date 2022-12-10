import { afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { NotFoundMiddleware } from './not-found.middleware';
import { TestRequest, TestResponse } from '../tests/helpers/express-mocks';

describe('middlewares/not-found', () => {
  /** @type {NotFoundMiddleware} */
  let middleware;
  /** @type {import('express').Request} */
  let request;
  /** @type {import('express').Response} */
  let response;

  beforeAll(() => {
    middleware = new NotFoundMiddleware();

    request = new TestRequest();
    response = new TestResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(middleware.handler).toBeDefined();
  });

  it('should return 404 with not found message', async () => {
    await middleware.handler(request, response);

    expect(response.status).toBeCalledWith(404);
    expect(response.json).toBeCalledWith({ message: 'Resource not found' });
  });
});
