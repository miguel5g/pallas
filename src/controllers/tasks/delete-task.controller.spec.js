import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { DeleteTaskController } from './delete-task.controller';
import { DeleteTaskService } from '../../services/tasks/delete-task.service';
import { TestRequest, TestResponse } from '../../tests/helpers/express-mocks';

describe('controllers/delete-task', () => {
  /** @type {DeleteTaskController} */
  let controller;
  /** @type {import('express').Request} */
  let request;
  /** @type {import('express').Response} */
  let response;

  beforeAll(() => {
    DeleteTaskService.prototype.handler = jest.fn();
    request = new TestRequest();
    response = new TestResponse();
  });

  beforeEach(() => {
    controller = new DeleteTaskController(new DeleteTaskService());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(controller.handler).toBeDefined();
  });

  it('should throw an error if not pass service to controller constructor', () => {
    expect(() => new DeleteTaskController()).toThrow('Invalid service instance');
  });

  it('should calls service with task id and user id', async () => {
    const input = ['task id', 'user id'];

    request.params = { id: input[0] };
    request.user = { id: input[1] };

    await controller.handler(request, response);

    expect(DeleteTaskService.prototype.handler).toHaveBeenCalledWith(...input);
    expect(response.json).toHaveBeenCalledWith({ message: 'Task successfully deleted' });
  });
});
