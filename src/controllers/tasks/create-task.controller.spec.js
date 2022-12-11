import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ZodError } from 'zod';

import { CreateTaskController } from './create-task.controller';
import { CreateTaskService } from '../../services/tasks/create-task.service';
import { TestRequest, TestResponse } from '../../tests/helpers/express-mocks';

describe('controllers/create-task', () => {
  /** @type {CreateTaskController} */
  let controller;
  /** @type {import('express').Request} */
  let request;
  /** @type {import('express').Response} */
  let response;

  beforeAll(() => {
    CreateTaskService.prototype.handler = jest.fn();
  });

  beforeEach(() => {
    controller = new CreateTaskController(new CreateTaskService());

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
    expect(() => new CreateTaskController()).toThrow('Invalid service instance');
  });

  it('should throw an error if task title is less than three characters', async () => {
    request.body = { title: 'hi' };

    expect(controller.handler(request, response)).rejects.toBeInstanceOf(ZodError);
  });

  it('should throw an error if task title is longer than one thousand and twenty eight characters', async () => {
    request.body = { title: Array.from({ length: 129 }, () => 'a') };

    expect(controller.handler(request, response)).rejects.toBeInstanceOf(ZodError);
  });

  it('should calls service with user id and request body', async () => {
    const user = { id: 'user id' };
    const task = { title: 'Hello World' };

    request.user = user;
    request.body = task;

    await controller.handler(request, response);

    expect(CreateTaskService.prototype.handler).toBeCalledWith({ ...task, authorId: user.id });
  });

  it('should calls json with service with success message', async () => {
    const user = { id: 'user id' };
    const task = { title: 'Hello World' };

    request.user = user;
    request.body = task;

    await controller.handler(request, response);

    expect(response.json).toBeCalledWith({ message: 'Task successfully created' });
  });
});
