import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { GetUserByIdController } from './get-user-by-id.controller';
import { GetUserByIdService } from '../services/get-user-by-id.service';
import { TestRequest, TestResponse } from '../tests/helpers/express-mocks';

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

  it('should calls service.handler', async () => {
    await controller.handler(request, response);

    expect(GetUserByIdService.prototype.handler).toBeCalledTimes(1);
  });

  it('should return a json body with user infos', async () => {
    request.params.id = 'user id';
    const expectedOutput = {
      name: 'sample user',
    };

    GetUserByIdService.prototype.handler.mockResolvedValueOnce(expectedOutput);

    await controller.handler(request, response);

    expect(GetUserByIdService.prototype.handler).toBeCalledWith(request.params.id);
    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith(expectedOutput);
  });
});
