import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import { appFactory } from '../../app';
import { compareText, hashText } from '../../libs/encryption';
import { prisma } from '../../libs/prisma';

describe('/api/users', () => {
  const app = appFactory();

  beforeAll(async () => {
    const password = await hashText('123456');

    await prisma.user.createMany({
      data: [
        {
          name: 'User',
          surname: 'One',
          password,
          email: 'mail.one@example.com',
        },
        {
          name: 'User',
          surname: 'Two',
          password,
          email: 'mail.two@example.com',
        },
        {
          name: 'User',
          surname: 'Three',
          password,
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

    it('should returns json content with pagination fields and users data', async () => {
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

  describe('POST /', () => {
    it('should returns json content with status 400 when passed body is invalid', async () => {
      const response = await request(app).post('/api/users');

      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid user body');
    });

    it('should returns json content with status 201 when passed body is valid', async () => {
      const input = {
        name: 'Hello',
        surname: 'World',
        email: 'hello@world.com',
        password: '123456',
      };

      const response = await request(app).post('/api/users').send(input);

      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'User created successfully');

      const user = await prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });

      expect(compareText(user.password, input.password)).resolves.toBe(true);
      expect(user).toEqual({
        id: expect.any(String),
        ...input,
        password: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
});
