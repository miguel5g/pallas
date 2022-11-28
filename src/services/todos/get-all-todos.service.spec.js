import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../../tests/helpers/prisma-mock';
import { prisma } from '../../libs/prisma';
import { GetAllTodosService } from './get-all-todos.service';

describe('services/get-all-todos', () => {
  /** @type {GetAllTodosService} */
  let service;

  beforeEach(() => {
    service = new GetAllTodosService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(service.handler).toBeDefined();
  });

  it('should calls prisma.todo.findMany', async () => {
    const input = 'user id';

    await service.handler(input);

    expect(prisma.todo.findMany).toBeCalledTimes(1);
    expect(prisma.todo.findMany).toBeCalledWith({
      where: {
        authorId: input,
      },
      select: expect.any(Object),
    });
  });

  it('should use select field to filter todo fields', async () => {
    await service.handler();

    expect(prisma.todo.findMany).toBeCalledWith({
      where: expect.any(Object),
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  it('should return all todos', async () => {
    const expected = ['todo 1', 'todo 2', 'todo 3'];

    prisma.todo.findMany.mockResolvedValueOnce(expected);

    const output = await service.handler();

    expect(output).toEqual(expected);
  });
});
