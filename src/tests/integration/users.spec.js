import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import { prisma } from '../../libs/prisma';
import { appFactory } from '../../app';

describe('/api/users', () => {
  const app = appFactory();

  beforeAll(async () => {
    await prisma.user.createMany({
      data: [
        {
          name: 'User',
          surname: 'One',
          password: '123456',
          email: 'mail.one@example.com',
        },
        {
          name: 'User',
          surname: 'Two',
          password: '123456',
          email: 'mail.two@example.com',
        },
        {
          name: 'User',
          surname: 'Three',
          password: '123456',
          email: 'mail.three@example.com',
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();

    await prisma.$disconnect();
  });

  describe('GET /', () => {
    it('should returns json content type with status code 200', async () => {
      const response = await request(app).get('/api/users');

      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    });

    it('should returns json body with pagination fields and users data', async () => {
      const { body } = await request(app).get('/api/users');

      expect(body).toHaveProperty('page', 1);
      expect(body).toHaveProperty('totalUsers', 3);
      expect(body).toHaveProperty('totalPages', 1);
      expect(body).toHaveProperty('perPage', 20);
      expect(body).toHaveProperty('users', expect.any(Array));

      body.users.forEach((user) => {
        expect(user).toHaveProperty('id', expect.any(String));
        expect(user).toHaveProperty('name', expect.any(String));
        expect(user).toHaveProperty('surname', expect.any(String));
        expect(user).toHaveProperty('createdAt', expect.any(String));
        expect(user).toHaveProperty('updatedAt', expect.any(String));
      });
    });
  });
});
