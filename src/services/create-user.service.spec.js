import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../tests/helpers/prisma-mock';
import { prisma } from '../libs/prisma';
import { CreateUserService } from './create-user.service';

describe('services/CreateUser', () => {
  /** @type {CreateUserService} */
  let service;

  beforeEach(() => {
    service = new CreateUserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have an handler method', () => {
    expect(service.handler).toBeInstanceOf(Function);
  });

  it('should calls prisma.user.create', async () => {
    const user = {
      name: 'User',
      surname: 'One',
      email: 'user.one@mail.com',
      password: '123456',
    };

    await service.handler(user);

    expect(prisma.user.create).toBeCalledTimes(1);
    expect(prisma.user.create).toBeCalledWith({ data: user });
  });

  it('should return void', async () => {
    const user = {
      name: 'User',
      surname: 'One',
      email: 'user.one@mail.com',
      password: '123456',
    };

    const output = await service.handler(user);

    expect(output).toBeUndefined();
  });
});
