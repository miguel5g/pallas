import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { UpdateTaskController } from './update-task.controller';
import { UpdateTaskService } from '../../services/tasks/update-task.service';
import { TestRequest, TestResponse } from '../../tests/helpers/express-mocks';
import { BadRequestError, UnprocessableError } from '../../errors';
import { ZodError } from 'zod';

describe('controllers/update-task', () => {
  /** @type {UpdateTaskController} */
  let controller;
  /** @type {import('express').Request} */
  let request;
  /** @type {import('express').Response} */
  let response;

  beforeAll(() => {
    UpdateTaskService.prototype.handler = jest.fn();
    request = new TestRequest();
    response = new TestResponse();
  });

  beforeEach(() => {
    controller = new UpdateTaskController(new UpdateTaskService());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(controller.handler).toBeDefined();
  });

  it('should throw an error if not pass service to controller constructor', () => {
    expect(() => new UpdateTaskController()).toThrow('Invalid service instance');
  });

  it('should throw unprocessable error if request body is empty or invalid', async () => {
    expect.assertions(5);
    {
      const { id, ...task } = { id: 'task id' };

      request.body = task;
      request.params = { id };

      try {
        await controller.handler(request, response);
      } catch (error) {
        expect(UpdateTaskService.prototype.handler).not.toBeCalled();
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error.message).toBe('Invalid request body');
      }
    }
    {
      const { id, ...task } = { id: 'task id', title: true };

      request.body = task;
      request.params = { id };

      try {
        await controller.handler(request, response);
      } catch (error) {
        expect(UpdateTaskService.prototype.handler).not.toBeCalled();
        expect(error).toBeInstanceOf(ZodError);
      }
    }
  });

  it('should calls service with task id and updated fields', async () => {
    const { id, ...task } = { id: 'task id', title: 'title updated' };

    request.params = { id };
    request.user = { id: 'user.one' };
    request.body = task;

    await controller.handler(request, response);

    expect(UpdateTaskService.prototype.handler).toBeCalledWith({ id, userId: 'user.one', ...task });
  });

  it('should calls json with service output', async () => {
    await controller.handler(request, response);

    expect(response.json).toBeCalledWith({ message: 'Task successfully updated' });
  });
});
