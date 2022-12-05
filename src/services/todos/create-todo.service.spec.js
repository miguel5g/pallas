import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../../tests/helpers/prisma-mock';
import { prisma } from '../../libs/prisma';
import { CreateTodoService } from './create-todo.service';

describe('services/get-all-todos', () => {
  /** @type {CreateTodoService} */
  let service;

  beforeEach(() => {
    service = new CreateTodoService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(service.handler).toBeDefined();
  });

  it('should create an todo with received data', async () => {
    const input = { title: 'new todo', authorId: 'user id' };

    await service.handler(input);

    expect(prisma.todo.create).toHaveBeenCalledWith({
      data: input,
    });
  });
});
