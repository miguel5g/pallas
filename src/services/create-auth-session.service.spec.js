import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../tests/helpers/encryption-mock';
import '../tests/helpers/prisma-mock';
import '../tests/helpers/token-mock';
import * as token from '../libs/token';
import * as encrypt from '../libs/encryption';
import { prisma } from '../libs/prisma';
import { CreateAuthSessionService } from './create-auth-session.service';
import { NotFoundError, UnauthorizedError } from '../errors';

describe('services/create-user-auth', () => {
  const mockUser = {
    id: 'hello world',
    email: 'user.one@mail.com',
    password: 'hashed',
    permissions: -1,
  };
  /** @type {CreateAuthSessionService} */
  let service;

  beforeEach(() => {
    service = new CreateAuthSessionService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(service.handler).toBeInstanceOf(Function);
  });

  it('should calls prisma.user.findUnique', async () => {
    encrypt.compareText.mockResolvedValueOnce(true);
    prisma.user.findUnique.mockResolvedValueOnce('user');

    await service.handler({});

    expect(prisma.user.findUnique).toBeCalledTimes(1);
  });

  it('should get user with id passed and select correct fields', async () => {
    encrypt.compareText.mockResolvedValueOnce(true);
    prisma.user.findUnique.mockResolvedValueOnce(mockUser);

    const input = {
      email: mockUser.email,
      password: 'test',
    };

    await service.handler(input);

    expect(prisma.user.findUnique).toBeCalledWith({
      where: { email: mockUser.email },
      select: {
        id: true,
        permissions: true,
        password: true,
      },
    });
  });

  it('should call the method compare text with the values passed', async () => {
    prisma.user.findUnique.mockResolvedValueOnce(mockUser);
    encrypt.compareText.mockResolvedValueOnce(true);

    const input = {
      email: mockUser.email,
      password: 'test',
    };

    await service.handler(input);

    expect(encrypt.compareText).toBeCalledTimes(1);
    expect(encrypt.compareText).toBeCalledWith(mockUser.password, input.password);
  });

  it("should throw a not found error when the email passed doesn't exist", async () => {
    expect.assertions(2);

    prisma.user.findUnique.mockResolvedValueOnce(null);

    const input = { email: 'any' };

    await service.handler(input).catch((error) => {
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('User not found');
    });
  });

  it('should throw an unauthorized error when password does not match', async () => {
    expect.assertions(2);

    encrypt.compareText.mockResolvedValueOnce(false);
    prisma.user.findUnique.mockResolvedValueOnce(mockUser);

    await service.handler('any', 'any').catch((error) => {
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect(error.message).toBe('Passwords do not match');
    });
  });

  it('should return a token with user id and permissions inside the payload', async () => {
    const mockToken = 'token';

    encrypt.compareText.mockResolvedValueOnce(true);
    prisma.user.findUnique.mockResolvedValueOnce(mockUser);
    token.encode.mockResolvedValueOnce(mockToken);

    const output = await service.handler('any', 'any');

    expect(token.encode).toBeCalledTimes(1);
    expect(token.encode).toBeCalledWith({ id: mockUser.id, permissions: mockUser.permissions });
    expect(output).toBe(mockToken);
  });
});
