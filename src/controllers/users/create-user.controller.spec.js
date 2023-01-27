import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { z } from 'zod';

import '../../tests/helpers/send-mail-mock';
import * as sendMailLib from '../../libs/send-mail';
import { CreateUserController } from './create-user.controller';
import { CreateUserService } from '../../services/users/create-user.service';
import { TestRequest, TestResponse } from '../../tests/helpers/express-mocks';

describe('controllers/create-user', () => {
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

  it('should throw an error when request body is empty', async () => {
    request.body = {};

    expect(controller.handler(request, response)).rejects.toBeInstanceOf(z.ZodError);
  });

  it('should throw an error when any property is invalid', async () => {
    expect.assertions(8);

    request.body = {
      ...user,
      surname: '',
    };

    controller.handler(request, response).catch((error) => {
      expect(error).toBeInstanceOf(z.ZodError);
      expect(error.issues).toHaveLength(1);
      expect(error.issues[0].code).toBe('too_small');
      expect(error.issues[0].path).toEqual(['surname']);
    });

    request.body = {
      ...user,
      email: undefined,
    };

    controller.handler(request, response).catch((error) => {
      expect(error).toBeInstanceOf(z.ZodError);
      expect(error.issues).toHaveLength(1);
      expect(error.issues[0].code).toBe('invalid_type');
      expect(error.issues[0].path).toEqual(['email']);
    });
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

  it('should send welcome email when user is created', async () => {
    request.body = user;

    await controller.handler(request, response);

    expect(response.status).toBeCalledWith(201);
    expect(sendMailLib.sendMail).toBeCalledWith('welcome', {
      to: user.email,
      name: user.name,
    });
  });
});
