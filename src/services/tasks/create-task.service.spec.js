import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../../tests/helpers/prisma-mock';
import { prisma } from '../../libs/prisma';
import { CreateTaskService } from './create-task.service';

describe('services/create-task', () => {
  /** @type {CreateTaskService} */
  let service;

  beforeEach(() => {
    service = new CreateTaskService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(service.handler).toBeDefined();
  });

  it('should create an task with received data', async () => {
    const input = { title: 'new task', authorId: 'user id' };

    await service.handler(input);

    expect(prisma.task.create).toHaveBeenCalledWith({ data: input });
  });
});
