import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../../tests/helpers/prisma-mock';
import { prisma } from '../../libs/prisma';
import { GetUserByIdService } from './get-user-by-id.service';
import { NotFoundError } from '../../errors';

describe('services/get-user-by-id', () => {
  /** @type {GetUserByIdService} */
  let service;

  beforeEach(() => {
    service = new GetUserByIdService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(service.handler).toBeInstanceOf(Function);
  });

  it('should calls prisma.user.findUnique', async () => {
    prisma.user.findUnique.mockResolvedValueOnce('user');

    await service.handler();

    expect(prisma.user.findUnique).toBeCalledTimes(1);
  });

  it('should get user with passed id and select fields', async () => {
    const id = 'id-test';

    prisma.user.findUnique.mockResolvedValueOnce('user');

    await service.handler(id);

    expect(prisma.user.findUnique).toBeCalledWith({
      where: { id },
      select: {
        id: true,
        name: true,
        surname: true,
        permissions: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  it("should throw a not found error if the user doesn't exists", async () => {
    expect.assertions(2);

    prisma.user.findUnique.mockResolvedValueOnce(null);

    await service.handler('unknown').catch((error) => {
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('User not found');
    });
  });

  it('should return prisma user', async () => {
    const user = { name: 'sample-user' };

    prisma.user.findUnique.mockResolvedValueOnce(user);

    const output = await service.handler();

    expect(output).toBe(user);
  });
});
