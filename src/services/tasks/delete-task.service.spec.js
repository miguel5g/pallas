import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../../tests/helpers/prisma-mock';
import { prisma } from '../../libs/prisma';
import { DeleteTaskService } from './delete-task.service';
import { NotFoundError } from '../../errors';

describe('services/delete-task', () => {
  /** @type {DeleteTaskService} */
  let service;

  beforeEach(() => {
    service = new DeleteTaskService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(service.handler).toBeDefined();
  });

  it('should throw a not found error if the task does not exist', async () => {
    expect.assertions(4);

    prisma.task.findFirst.mockResolvedValueOnce(null);

    const input = ['task id', 'user id'];

    try {
      await service.handler(...input);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error).toHaveProperty('message', 'Task not found');
      expect(prisma.task.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.task.delete).not.toHaveBeenCalled();
    }
  });

  it('should find task using task id and author id', async () => {
    prisma.task.findFirst.mockResolvedValueOnce('anything no nullable');

    const input = ['task id', 'user id'];
    const expected = { where: { AND: [{ id: input[0] }, { authorId: input[1] }] } };

    await service.handler(...input);

    expect(prisma.task.findFirst).toHaveBeenCalledWith(expected);
  });

  it('should delete task on database', async () => {
    prisma.task.findFirst.mockResolvedValueOnce('anything no nullable');

    const input = ['task id', 'user id'];

    await service.handler(...input);

    expect(prisma.task.findFirst).toHaveBeenCalledTimes(1);
    expect(prisma.task.delete).toHaveBeenCalledTimes(1);
    expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: input[0] } });
  });
});
