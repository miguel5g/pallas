import { beforeEach, describe, expect, it } from '@jest/globals';

import '../tests/helpers/prisma-mock';
import { prisma } from '../libs/prisma';
import { GetAllUsersService } from './get-all-users.service';

describe('GetAllUsersController.js', () => {
  /** @type {GetAllUsersService} */
  let service;

  beforeEach(() => {
    service = new GetAllUsersService();
  });

  it('should have a handler method', () => {
    expect(service.handler).toBeDefined();
  });

  it('should calls prisma.user.findMany', async () => {
    await service.handler();

    expect(prisma.user.findMany).toBeCalledTimes(1);
  });

  it.todo('should use take and skip fields to paginate results');

  it.todo('should use min take and skip value if passed value is invalid');

  it.todo('should use select field to filter user fields');

  it.todo('should return an array with users object');
});
