import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { GetAllTasksController } from './get-all-tasks.controller';
import { GetAllTasksService } from '../../services/tasks/get-all-tasks.service';
import { TestRequest, TestResponse } from '../../tests/helpers/express-mocks';

describe('controllers/get-all-tasks', () => {
  /** @type {GetAllTasksController} */
  let controller;
  /** @type {import('express').Request} */
  let request;
  /** @type {import('express').Response} */
  let response;

  beforeAll(() => {
    GetAllTasksService.prototype.handler = jest.fn();
  });

  beforeEach(() => {
    controller = new GetAllTasksController(new GetAllTasksService());

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
    expect(() => new GetAllTasksController()).toThrow('Invalid service instance');
  });

  it('should calls service with user id', async () => {
    const expected = 'user id';

    request.user = { id: expected };

    await controller.handler(request, response);

    expect(GetAllTasksService.prototype.handler).toBeCalledWith(expected);
  });

  it('should calls json with service output', async () => {
    const expected = 'tasks';

    GetAllTasksService.prototype.handler.mockResolvedValueOnce(expected);

    await controller.handler(request, response);

    expect(response.json).toBeCalledWith({ tasks: expected });
  });
});
