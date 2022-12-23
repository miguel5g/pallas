import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { GetTaskByIdController } from './get-task-by-id.controller';
import { GetTaskByIdService } from '../../services/tasks/get-task-by-id.service';
import { TestRequest, TestResponse } from '../../tests/helpers/express-mocks';

describe('controllers/get-task-by-id', () => {
  /** @type {GetTaskByIdController} */
  let controller;
  /** @type {import('express').Request} */
  let request;
  /** @type {import('express').Response} */
  let response;

  beforeAll(() => {
    GetTaskByIdService.prototype.handler = jest.fn();
    request = new TestRequest();
    response = new TestResponse();
  });

  beforeEach(() => {
    controller = new GetTaskByIdController(new GetTaskByIdService());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(controller.handler).toBeDefined();
  });

  it('should throw an error if not pass service to controller constructor', () => {
    expect(() => new GetTaskByIdController()).toThrow('Invalid service instance');
  });

  it('should calls service with task id and user id', async () => {
    const input = ['task.one', 'user.one'];

    request.params = { id: input[0] };
    request.user = { id: input[1] };

    await controller.handler(request, response);

    expect(GetTaskByIdService.prototype.handler).toBeCalledWith(...input);
  });

  it('should calls json with service output', async () => {
    const expected = 'task';

    GetTaskByIdService.prototype.handler.mockResolvedValueOnce(expected);

    await controller.handler(request, response);

    expect(response.json).toBeCalledWith(expected);
  });
});
