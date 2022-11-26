import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';

import { DeleteAuthSessionController } from './delete-auth-session.controller';
import { TestRequest, TestResponse } from '../../tests/helpers/express-mocks';

describe('controllers/delete-auth-session', () => {
  const systemTime = new Date(2022, 9, 29, 12);
  let environment;
  /** @type {DeleteAuthSessionController} */
  let controller;
  /** @type {import('express').Request} */
  let request;
  /** @type {import('express').Response} */
  let response;

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(systemTime);
  });

  beforeEach(() => {
    environment = process.env;
    controller = new DeleteAuthSessionController();
    request = new TestRequest();
    response = new TestResponse();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    process.env = environment;
  });

  it('should have an handler method', () => {
    expect(controller.handler).toBeInstanceOf(Function);
  });

  it('should clear the token cookie', async () => {
    {
      process.env.NODE_ENV = 'development';

      await controller.handler(request, response);

      expect(response.cookie).toBeCalledTimes(1);
      expect(response.cookie).toBeCalledWith('token', '', {
        expires: new Date(),
        httpOnly: true,
        path: '/',
        secure: false,
      });
    }
    {
      process.env.NODE_ENV = 'production';

      await controller.handler(request, response);

      expect(response.cookie).toBeCalledWith('token', '', {
        expires: new Date(),
        httpOnly: true,
        path: '/',
        secure: true,
      });
    }
  });

  it('should return a status of 200 with a message', async () => {
    await controller.handler(request, response);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({
      message: 'Session deleted successfully',
    });
  });
});
