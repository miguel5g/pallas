import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { appFactory } from '../../app';
import { hashText } from '../../libs/encryption';
import { prisma } from '../../libs/prisma';

describe('/api/auth', () => {
  const app = appFactory();
  const systemTime = Date.UTC(2022, 9, 29, 12);

  beforeAll(async () => {
    jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] }).setSystemTime(systemTime);
    const password = await hashText('123456');

    await prisma.user.create({
      data: {
        id: 'user.one',
        name: 'User',
        surname: 'One',
        password,
        email: 'mail.one@example.com',
      },
    });
  });

  afterAll(async () => {
    jest.useRealTimers();
    await prisma.user.deleteMany();

    await prisma.$disconnect();
  });

  describe('POST /', () => {
    it('should return a message and status 500 when request body is invalid', async () => {
      const response = await request(app).post('/api/auth');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Invalid request body',
        errors: [
          {
            code: 'invalid_type',
            message: 'The "email" field must be a string',
          },
          {
            code: 'invalid_type',
            message: 'The "password" field must be a string',
          },
        ],
      });
    });

    it("should return a message and status 404 when user doesn't exists", async () => {
      const response = await request(app)
        .post('/api/auth')
        .send({ email: 'not.found@mail.com', password: '123456' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'User not found' });
    });

    it("should return unauthorized when passwords don't matches", async () => {
      const response = await request(app)
        .post('/api/auth')
        .send({ email: 'mail.one@example.com', password: 'invalid pass' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Passwords do not match' });
    });

    it('should return a 201 status with set-cookie header when the password matches', async () => {
      const response = await request(app)
        .post('/api/auth')
        .send({ email: 'mail.one@example.com', password: '123456' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'Successfully authenticated' });
      expect(response.headers['set-cookie']).toHaveLength(1);
      expect(response.headers['set-cookie'][0]).toMatch(
        /^token=.+\..+\..+;\sPath=\/; Expires=Sun, 30 Oct 2022 12:00:00 GMT; HttpOnly$/
      );
    });
  });
});
