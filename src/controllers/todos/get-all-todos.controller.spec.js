import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { GetAllTodosController } from './get-all-todos.controller';
import { GetAllTodosService } from '../../services/todos/get-all-todos.service';
import { TestRequest, TestResponse } from '../../tests/helpers/express-mocks';

describe('controllers/get-all-todos', () => {
  /** @type {GetAllTodosController} */
  let controller;
  /** @type {import('express').Request} */
  let request;
  /** @type {import('express').Response} */
  let response;

  beforeAll(() => {
    GetAllTodosService.prototype.handler = jest.fn();
  });

  beforeEach(() => {
    controller = new GetAllTodosController(new GetAllTodosService());

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
    expect(() => new GetAllTodosController()).toThrow('Invalid service instance');
  });

  it('should calls service with user id', async () => {
    const expected = 'user id';

    request.user = {
      id: expected,
    };

    await controller.handler(request, response);

    expect(GetAllTodosService.prototype.handler).toBeCalledWith(expected);
  });

  it('should calls json with service output', async () => {
    const expected = 'todos';

    GetAllTodosService.prototype.handler.mockResolvedValueOnce(expected);

    await controller.handler(request, response);

    expect(response.json).toBeCalledWith({ todos: expected });
  });
});
