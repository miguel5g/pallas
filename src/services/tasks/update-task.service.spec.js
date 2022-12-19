import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../../tests/helpers/prisma-mock';
import { TestPrismaKnowError } from '../../tests/helpers/prisma-client-mock';
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

  it('should calls prisma.task.update with received values', async () => {
    const { id, ...input } = { id: 'task id', title: 'new task title' };

    await service.handler({ id, ...input });

    expect(prisma.task.update).toBeCalledTimes(1);
    expect(prisma.task.update).toBeCalledWith({
      where: {
        id,
      },
      data: input,
    });
  });

  it('should throw not found error if it not exists', async () => {
    expect.assertions(2);

    const { id, ...input } = { id: 'task id', title: 'new task title' };

    prisma.task.update.mockImplementationOnce(() => {
      throw new TestPrismaKnowError('P2025');
    });

    try {
      await service.handler({ id, ...input });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('Task not found');
    }
  });

  it('should throw the original error if it is unknown', async () => {
    expect.assertions(1);

    const originalError = new Error('Original error');
    const { id, ...input } = { id: 'task id', title: 'new task title' };

    prisma.task.update.mockImplementationOnce(() => {
      throw originalError;
    });

    try {
      await service.handler({ id, ...input });
    } catch (error) {
      expect(error).toBe(originalError);
    }
  });
});
