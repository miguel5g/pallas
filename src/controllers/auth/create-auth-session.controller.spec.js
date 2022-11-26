import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { z } from 'zod';

import { CreateAuthSessionController } from './create-auth-session.controller';
import { CreateAuthSessionService } from '../../services/auth/create-auth-session.service';
import { TestRequest, TestResponse } from '../../tests/helpers/express-mocks';

describe('controllers/create-auth-session', () => {
  const systemTime = new Date(2022, 9, 29, 12);
  let environment;
  /** @type {CreateAuthSessionController} */
  let controller;
  /** @type {import('express').Request} */
  let request;
  /** @type {import('express').Response} */
  let response;

  beforeAll(() => {
    CreateAuthSessionService.prototype.handler = jest.fn();
    jest.useFakeTimers().setSystemTime(systemTime);
  });

  beforeEach(() => {
    environment = process.env;
    controller = new CreateAuthSessionController(new CreateAuthSessionService());

    request = new TestRequest();
    response = new TestResponse();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    process.env = environment;
    jest.clearAllMocks();
  });

  it('should have an handler method', () => {
    expect(controller.handler).toBeInstanceOf(Function);
  });

  it('should throw an error if it receives an invalid service instance', () => {
    {
      expect(() => new CreateAuthSessionController()).toThrow('Invalid service instance');
    }
    {
      expect(() => new CreateAuthSessionController(controller)).toThrow('Invalid service instance');
    }
  });

  it('should thrown an error if request body is empty', async () => {
    request.body = {};

    await expect(controller.handler(request, response)).rejects.toBeInstanceOf(z.ZodError);
  });

  it('should throw an error when any property of the request body is invalid', async () => {
    {
      request.body = {
        email: 'user.one@mail.com',
      };

      await expect(controller.handler(request, response)).rejects.toBeInstanceOf(z.ZodError);
    }
    {
      request.body = {
        password: '123456',
      };

      await expect(controller.handler(request, response)).rejects.toBeInstanceOf(z.ZodError);
    }
  });

  it('should calls service with request body data', async () => {
    const credentials = { email: 'user.one@mail.com', password: '123456' };
    request.body = credentials;

    await controller.handler(request, response);

    expect(CreateAuthSessionService.prototype.handler).toBeCalledTimes(1);
    expect(CreateAuthSessionService.prototype.handler).toBeCalledWith(credentials);
  });

  it('should set response token cookie with service return', async () => {
    const tokenMock = 'token-mock';
    const credentials = { email: 'user.one@mail.com', password: '123456' };

    request.body = credentials;

    CreateAuthSessionService.prototype.handler
      .mockResolvedValueOnce(tokenMock)
      .mockResolvedValueOnce(tokenMock);

    {
      await controller.handler(request, response);

      expect(response.cookie).toBeCalledTimes(1);
      expect(response.cookie).toBeCalledWith('token', tokenMock, {
        expires: new Date(2022, 9, 30, 12),
        httpOnly: true,
        path: '/',
        secure: false,
      });
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(201);
      expect(response.json).toBeCalledTimes(1);
      expect(response.json).toBeCalledWith({ message: 'Successfully authenticated' });
    }
    {
      process.env.NODE_ENV = 'production';

      await controller.handler(request, response);

      expect(response.cookie).toBeCalledWith('token', tokenMock, {
        expires: new Date(2022, 9, 30, 12),
        httpOnly: true,
        path: '/',
        secure: true,
      });
    }
  });
});
