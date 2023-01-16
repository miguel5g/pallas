import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import { appFactory } from '../../app';
import { compareText, hashText } from '../../libs/encryption';
import { prisma } from '../../libs/prisma';
import { encode } from '../../libs/token';

describe('/api/users', () => {
  const app = appFactory();

  beforeAll(async () => {
    const password = await hashText('123456');

    await prisma.user.createMany({
      data: [
        {
          id: 'user.one',
          name: 'User',
          surname: 'One',
          password,
          email: 'mail.one@example.com',
        },
        {
          id: 'user.two',
          name: 'User',
          surname: 'Two',
          password,
          email: 'mail.two@example.com',
        },
        {
          id: 'user.three',
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
    it('should return unauthorized when user does not send token', async () => {
      const response = await request(app).get('/api/users');

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid token' });
    });

    it('should return unauthorized when user send an invalid token', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Cookie', ['token=invalid; Path=/']);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: 'Your token is invalid' });
    });

    it('should return unauthorized when user does have correct permissions', async () => {
      const token = encode({ id: 'admin', permissions: 0 });

      const response = await request(app)
        .get('/api/users')
        .set('Cookie', [`token=${token}`]);

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ message: 'Forbidden' });
    });

    it('should returns json content type with status code 200', async () => {
      const token = encode({ id: 'admin', permissions: 2 });

      const response = await request(app)
        .get('/api/users')
        .set('Cookie', [`token=${token}`]);

      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    });

    it('should returns json content with pagination fields and users data', async () => {
      const token = encode({ id: 'admin', permissions: 2 });

      const { body } = await request(app)
        .get('/api/users')
        .set('Cookie', [`token=${token}`]);

      expect(body).toEqual({
        page: 1,
        totalUsers: 3,
        totalPages: 1,
        perPage: 20,
        users: expect.any(Array),
      });

      body.users.forEach((user) => {
        expect(user).toEqual({
          id: expect.any(String),
          name: expect.any(String),
          surname: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
    });
  });

  describe('POST /', () => {
    it('should returns json content with status 400 when passed body is invalid', async () => {
      const response = await request(app).post('/api/users');

      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        message: 'Invalid request body',
        errors: [
          {
            code: 'invalid_type',
            message: 'The "name" field must be a string',
          },
          {
            code: 'invalid_type',
            message: 'The "surname" field must be a string',
          },
          {
            code: 'invalid_type',
            message: 'The "password" field must be a string',
          },
          {
            code: 'invalid_type',
            message: 'The "email" field must be a string',
          },
        ],
      });
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
      expect(response.body).toEqual({ message: 'User created successfully' });

      const user = await prisma.user.findUnique({ where: { email: input.email } });

      expect(compareText(user.password, input.password)).resolves.toBe(true);
      expect(user).toEqual({
        id: expect.any(String),
        ...input,
        permissions: 0,
        password: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('GET /:id', () => {
    it('should return unauthorized when user does not send token', async () => {
      const response = await request(app).get('/api/users/user.two');

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid token' });
    });

    it('should return unauthorized when user send an invalid token', async () => {
      const response = await request(app)
        .get('/api/users/user.two')
        .set('Cookie', ['token=invalid; Path=/']);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: 'Your token is invalid' });
    });

    it('should return unauthorized when user does have correct permissions', async () => {
      const token = encode({ id: 'admin', permissions: 0 });

      const response = await request(app)
        .get('/api/users/user.two')
        .set('Cookie', [`token=${token}`]);

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ message: 'Forbidden' });
    });

    it('should return user data with status 200', async () => {
      const token = encode({ id: 'admin', permissions: 2 });

      const response = await request(app)
        .get('/api/users/user.one')
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'user.one',
        name: 'User',
        surname: 'One',
        permissions: 0,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should return an message and status 404 when user doesn't exists", async () => {
      const token = encode({ id: 'admin', permissions: 2 });

      const response = await request(app)
        .get('/api/users/invalid')
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'User not found' });
    });
  });
});
