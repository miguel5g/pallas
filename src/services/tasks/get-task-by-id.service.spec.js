import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../../tests/helpers/prisma-mock';
import { prisma } from '../../libs/prisma';
import { GetTaskByIdService } from './get-task-by-id.service';
import { NotFoundError } from '../../errors';

describe('services/get-task-by-id', () => {
  /** @type {GetTaskByIdService} */
  let service;

  beforeEach(() => {
    service = new GetTaskByIdService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(service.handler).toBeDefined();
  });

  it('should calls prisma.task.findFirst', async () => {
    const input = ['task.one', 'user.one'];

    prisma.task.findFirst.mockResolvedValueOnce('any');

    await service.handler(...input);

    expect(prisma.task.findFirst).toBeCalledTimes(1);
    expect(prisma.task.findFirst).toBeCalledWith({
      where: { id: input[0], authorId: input[1] },
      select: expect.any(Object),
    });
  });

  it('should use select to filter task fields', async () => {
    prisma.task.findFirst.mockResolvedValueOnce('any');

    await service.handler();

    expect(prisma.task.findFirst).toBeCalledWith({
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

  it('should return task if it exists', async () => {
    const expected = 'task 1';

    prisma.task.findFirst.mockResolvedValueOnce(expected);

    const output = await service.handler();

    expect(output).toEqual(expected);
  });

  it('should throw not found error if it not exists', async () => {
    expect.assertions(2);

    prisma.task.findFirst.mockResolvedValueOnce(null);

    try {
      await service.handler();
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('Task not found');
    }
  });
});
