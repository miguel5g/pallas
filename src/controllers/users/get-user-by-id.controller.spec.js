import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { GetUserByIdController } from './get-user-by-id.controller';
import { GetUserByIdService } from '../../services/users/get-user-by-id.service';
import { TestRequest, TestResponse } from '../../tests/helpers/express-mocks';
import { ForbiddenError } from '../../errors';

describe('controllers/get-user-by-id.js', () => {
  /** @type {GetUserByIdController} */
  let controller;
  /** @type {import('express').Request} */
  let request;
  /** @type {import('express').Response} */
  let response;

  beforeAll(() => {
    GetUserByIdService.prototype.handler = jest.fn();
  });

  beforeEach(() => {
    controller = new GetUserByIdController(new GetUserByIdService());

    request = new TestRequest();
    response = new TestResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(controller.handler).toBeDefined();
  });

  it('should throw an error if not pass service to controller constructor', () => {
    expect(() => new GetUserByIdController()).toThrow('Invalid service instance');
  });

  it('should throw forbidden error if not find user permissions', async () => {
    await expect(controller.handler(request, response)).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('should throw an forbidden error if the user does not have the correct permissions', async () => {
    request.user = {
      id: 'test',
      permissions: 0,
    };

    await expect(controller.handler(request, response)).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('should calls service.handler', async () => {
    request.user = {
      id: 'test',
      permissions: 2,
    };

    await controller.handler(request, response);

    expect(GetUserByIdService.prototype.handler).toBeCalledTimes(1);
  });

  it('should return a json body with user infos', async () => {
    request.params.id = 'user id';
    request.user = {
      id: 'test',
      permissions: 2,
    };

    const expectedOutput = { name: 'sample user' };

    GetUserByIdService.prototype.handler.mockResolvedValueOnce(expectedOutput);

    await controller.handler(request, response);

    expect(GetUserByIdService.prototype.handler).toBeCalledWith(request.params.id);
    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith(expectedOutput);
  });
});
