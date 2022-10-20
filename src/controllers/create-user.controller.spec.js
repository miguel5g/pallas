import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { CreateUserController } from './create-user.controller';
import { CreateUserService } from '../services/create-user.service';
import { TestRequest, TestResponse } from '../tests/helpers/express-mocks';

describe('controllers/CreateUser', () => {
  const user = {
    name: 'Hello',
    surname: 'World',
    email: 'hello@world.com',
    password: '1243456',
  };

  /** @type {CreateUserController} */
  let controller;
  /** @type {import('express').Request} */
  let request;
  /** @type {import('express').Response} */
  let response;

  beforeAll(() => {
    CreateUserService.prototype.handler = jest.fn();
  });

  beforeEach(() => {
    controller = new CreateUserController(new CreateUserService());

    request = new TestRequest();
    response = new TestResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have an handler method', () => {
    expect(controller.handler).toBeInstanceOf(Function);
  });

  it('should return json body with status code 400 when request body is empty', async () => {
    request.body = {};

    await controller.handler(request, response);

    expect(response.status).toBeCalledTimes(1);
    expect(response.status).toBeCalledWith(400);
    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({ message: 'Invalid user body' });
  });

  it('should return json body with status code 400 when any property is invalid', async () => {
    {
      request.body = {
        ...user,
        surname: '',
      };

      await controller.handler(request, response);

      expect(response.status).toBeCalledWith(400);
      expect(response.json).toBeCalledWith({ message: 'Invalid user body' });
    }
    {
      request.body = {
        ...user,
        email: undefined,
      };

      await controller.handler(request, response);

      expect(response.status).toBeCalledWith(400);
      expect(response.json).toBeCalledWith({ message: 'Invalid user body' });
    }
  });

  it('should calls create user service if request body is valid', async () => {
    request.body = user;

    await controller.handler(request, response);

    expect(CreateUserService.prototype.handler).toBeCalledTimes(1);
    expect(CreateUserService.prototype.handler).toBeCalledWith(user);
  });

  it('should return message with success when user is created', async () => {
    request.body = user;

    await controller.handler(request, response);

    expect(response.status).toBeCalledWith(201);
    expect(response.json).toBeCalledWith({ message: 'User created successfully' });
  });
});
