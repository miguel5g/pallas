import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../tests/helpers/prisma-mock';
import { prisma } from '../libs/prisma';
import { GetAllUsersService } from './get-all-users.service';

describe('GetAllUsersController.js', () => {
  /** @type {GetAllUsersService} */
  let service;

  beforeEach(() => {
    service = new GetAllUsersService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(service.handler).toBeDefined();
  });

  it('should calls prisma.user.count', async () => {
    await service.handler();

    expect(prisma.user.count).toBeCalledTimes(1);
    expect(prisma.user.count).toBeCalledWith();
  });

  it('should calls prisma.user.findMany', async () => {
    await service.handler();

    expect(prisma.user.findMany).toBeCalledTimes(1);
  });

  it('should use take and skip fields to paginate results', async () => {
    await service.handler(1);

    expect(prisma.user.findMany).toBeCalledWith({ skip: 0, take: 20, select: expect.anything() });
  });

  it('should use take and skip fields to paginate results when page is passed', async () => {
    await service.handler(15);

    expect(prisma.user.findMany).toBeCalledWith({
      skip: 280,
      take: 20,
      select: expect.anything(),
    });
  });

  it('should use min take and skip value if passed page value is 0', async () => {
    await service.handler(0);

    expect(prisma.user.findMany).toBeCalledWith({ skip: 0, take: 20, select: expect.anything() });
  });

  it('should use min take and skip value if passed page value is an float', async () => {
    await service.handler(1.5);

    expect(prisma.user.findMany).toBeCalledWith({ skip: 0, take: 20, select: expect.anything() });
  });

  it('should use min take and skip value if passed page value is a NaN', async () => {
    await service.handler();

    expect(prisma.user.findMany).toBeCalledWith({ skip: 0, take: 20, select: expect.anything() });
  });

  it('should use select field to filter user fields', async () => {
    await service.handler();

    expect(prisma.user.findMany).toBeCalledWith({
      skip: expect.anything(),
      take: expect.anything(),
      select: {
        id: true,
        name: true,
        surname: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  it('should return an object with paginate fields and users data', async () => {
    const users = ['user 1', 'user 2', 'user 3'];

    prisma.user.count.mockResolvedValueOnce(600);
    prisma.user.findMany.mockResolvedValueOnce(users);

    const output = await service.handler(15);

    expect(output).toEqual({
      page: 15,
      totalUsers: 600,
      totalPages: 30,
      perPage: 20,
      users,
    });
  });
});
