import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { appFactory } from '../../app';
import { hashText } from '../../libs/encryption';
import { prisma } from '../../libs/prisma';
import { encode } from '../../libs/token';

describe('/api/todos', () => {
  const app = appFactory();

  beforeAll(async () => {
    const password = await hashText('123456');

    const users = [
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
    ];

    const todos = [
      { id: 'todo.one', title: 'My first todo', authorId: 'user.one' },
      { id: 'todo.two', title: 'My second todo', authorId: 'user.one' },
      { id: 'todo.three', title: 'My third todo', authorId: 'user.two' },
      { id: 'todo.four', title: 'My fourth todo', authorId: 'user.two' },
    ];

    await prisma.user.createMany({ data: users });
    await prisma.todo.createMany({ data: todos });
  });

  afterAll(async () => {
    jest.useRealTimers();

    const deleteTodos = prisma.todo.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteTodos, deleteUsers]);

    await prisma.$disconnect();
  });

  describe('GET /', () => {
    it('should return unauthorized when user does not send token', async () => {
      const response = await request(app).get('/api/todos');

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid token' });
    });

    it('should return unauthorized when user send an invalid token', async () => {
      const response = await request(app)
        .get('/api/todos')
        .set('Cookie', ['token=invalid; Path=/']);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: 'Your token is invalid' });
    });

    it('should returns json content type with status code 200', async () => {
      const token = encode({ id: 'user.one', permissions: 0 });

      const response = await request(app)
        .get('/api/todos')
        .set('Cookie', [`token=${token}`]);

      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    });

    it('should returns user todos array', async () => {
      const token = encode({ id: 'user.one', permissions: 0 });

      const { body } = await request(app)
        .get('/api/todos')
        .set('Cookie', [`token=${token}`]);

      expect(body).toEqual({ todos: expect.any(Array) });
      expect(body.todos).toEqual([
        {
          id: 'todo.one',
          title: 'My first todo',
          status: 'TODO',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: 'todo.two',
          title: 'My second todo',
          status: 'TODO',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });
  });

  describe('POST /', () => {
    it('should return unauthorized when user is not logged in', async () => {
      const response = await request(app).post('/api/todos');

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid token' });
    });

    it('should returns 400 when request body is invalid', async () => {
      expect.assertions(4);

      const token = encode({ id: 'user.one', permissions: 0 });

      {
        const response = await request(app)
          .post('/api/todos')
          .set('Cookie', [`token=${token}`])
          .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: 'Invalid request body',
          errors: [
            {
              code: 'invalid_type',
              message: 'The "title" field must be a string',
            },
          ],
        });
      }
      {
        const response = await request(app)
          .post('/api/todos')
          .set('Cookie', [`token=${token}`])
          .send({ title: 'ma' });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: 'Invalid request body',
          errors: [
            {
              code: 'too_small',
              message: 'The minimum length of the "title" field is 6 characters',
            },
          ],
        });
      }
    });

    it('must create the todo and connect it to its author', async () => {
      const token = encode({ id: 'user.one', permissions: 0 });
      const input = { title: 'Make a cake' };

      const response = await request(app)
        .post('/api/todos')
        .set('Cookie', [`token=${token}`])
        .send(input);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ message: 'Todo successfully created' });

      const todo = await prisma.todo.findFirst({ where: input });

      expect(todo).toEqual({
        id: expect.any(String),
        title: input.title,
        status: 'TODO',
        authorId: 'user.one',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
});
