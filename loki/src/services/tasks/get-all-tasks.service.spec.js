import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../../tests/helpers/prisma-mock';
import { prisma } from '../../libs/prisma';
import { GetAllTasksService } from './get-all-tasks.service';

describe('services/get-all-tasks', () => {
  /** @type {GetAllTasksService} */
  let service;

  beforeEach(() => {
    service = new GetAllTasksService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(service.handler).toBeDefined();
  });

  it('should calls prisma.task.findMany', async () => {
    const input = 'user id';

    await service.handler(input);

    expect(prisma.task.findMany).toBeCalledTimes(1);
    expect(prisma.task.findMany).toBeCalledWith({
      where: {
        authorId: input,
      },
      select: expect.any(Object),
    });
  });

  it('should use select to filter task fields', async () => {
    await service.handler();

    expect(prisma.task.findMany).toBeCalledWith({
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

  it('should return all tasks', async () => {
    const expected = ['task 1', 'task 2', 'task 3'];

    prisma.task.findMany.mockResolvedValueOnce(expected);

    const output = await service.handler();

    expect(output).toEqual(expected);
  });
});
