import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../tests/helpers/encryption-mock';
import '../tests/helpers/prisma-mock';
import * as encryption from '../libs/encryption';
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

    encryption.hashText.mockResolvedValueOnce('any');

    await service.handler(user);

    expect(prisma.user.create).toBeCalledTimes(1);
    expect(prisma.user.create).toBeCalledWith({ data: { ...user, password: expect.any(String) } });
  });

  it('should encrypt the password before sending to the database', async () => {
    const encryptedPassword = 'encrypted-password';
    const user = {
      name: 'User',
      surname: 'One',
      email: 'user.one@mail.com',
      password: '123456',
    };

    encryption.hashText.mockResolvedValueOnce(encryptedPassword);

    await service.handler(user);

    expect(encryption.hashText).toBeCalledTimes(1);
    expect(encryption.hashText).toBeCalledWith(user.password);
    expect(prisma.user.create).toBeCalledWith({ data: { ...user, password: encryptedPassword } });
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
