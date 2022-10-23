import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { GetAllUsersController } from './get-all-users.controller';
import { GetAllUsersService } from '../services/get-all-users.service';
import { TestRequest, TestResponse } from '../tests/helpers/express-mocks';

describe('controllers/get-all-users', () => {
  /** @type {GetAllUsersController} */
  let controller;
  /** @type {import('express').Request} */
  let request;
  /** @type {import('express').Response} */
  let response;

  beforeAll(() => {
    GetAllUsersService.prototype.handler = jest.fn();
  });

  beforeEach(() => {
    controller = new GetAllUsersController(new GetAllUsersService());

    request = new TestRequest();
    response = new TestResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(controller.handler).toBeDefined();
  });

  it('should calls service.handler', async () => {
    await controller.handler(request, response);

    expect(GetAllUsersService.prototype.handler).toBeCalledTimes(1);
  });

  it('should return a json body with pagination', async () => {
    request.query.page = '15';
    const expectedOutput = {
      page: 15,
      limit: 20,
      users: ['user 1', 'user 2', 'user 3'],
    };

    GetAllUsersService.prototype.handler.mockResolvedValueOnce(expectedOutput);

    await controller.handler(request, response);

    expect(GetAllUsersService.prototype.handler).toBeCalledWith(15);
    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith(expectedOutput);
  });

  it('should return pagination fields when multiple page number has been passed', async () => {
    request.query.page = ['30', '15'];
    const expectedOutput = {
      page: 30,
      limit: 20,
      users: ['user 1', 'user 2', 'user 3'],
    };

    GetAllUsersService.prototype.handler.mockResolvedValueOnce(expectedOutput);

    await controller.handler(request, response);

    expect(GetAllUsersService.prototype.handler).toBeCalledWith(30);
    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith(expectedOutput);
  });

  it('should throw an error if not pass service to controller constructor', () => {
    expect(() => new GetAllUsersController()).toThrow('Invalid service instance');
  });
});
