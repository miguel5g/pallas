import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../../tests/helpers/prisma-mock';
import { prisma } from '../../libs/prisma';
import { UpdateTaskService } from './update-task.service';
import { NotFoundError } from '../../errors';

describe('services/update-task', () => {
  /** @type {UpdateTaskService} */
  let service;

  beforeEach(() => {
    service = new UpdateTaskService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(service.handler).toBeDefined();
  });

  it('should find if task exists', async () => {
    const id = 'task.one';
    const userId = 'user.one';
    const input = { title: 'updated task title' };

    prisma.task.findFirst.mockResolvedValueOnce('anything not nullable');

    await service.handler({ id, userId, ...input });

    expect(prisma.task.findFirst).toBeCalledTimes(1);
    expect(prisma.task.findFirst).toBeCalledWith({
      where: { AND: [{ id }, { authorId: userId }] },
    });
  });

  it('should throw not found error if it not exists', async () => {
    expect.assertions(2);

    const id = 'task.one';
    const userId = 'user.one';
    const input = { title: 'updated task title' };

    prisma.task.findFirst.mockResolvedValueOnce(null);

    try {
      await service.handler({ id, userId, ...input });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('Task not found');
    }
  });

  it('should throw not found error if the task belongs to someone else', async () => {
    expect.assertions(3);

    const id = 'task.one';
    const userId = 'user.one';
    const input = { title: 'updated task title' };

    prisma.task.findFirst.mockResolvedValueOnce(null);

    try {
      await service.handler({ id, userId, ...input });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('Task not found');
      expect(prisma.task.update).not.toBeCalled();
    }
  });

  it('should update task', async () => {
    const id = 'task.one';
    const userId = 'user.one';
    const input = { title: 'updated task title' };

    prisma.task.findFirst.mockResolvedValueOnce('anything not nullable');

    await service.handler({ id, userId, ...input });

    expect(prisma.task.update).toBeCalledTimes(1);
    expect(prisma.task.update).toBeCalledWith({
      where: {
        id,
      },
      data: input,
    });
  });
});
