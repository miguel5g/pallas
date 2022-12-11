import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { appFactory } from '../../app';
import { hashText } from '../../libs/encryption';
import { prisma } from '../../libs/prisma';
import { encode } from '../../libs/token';

describe('/api/tasks', () => {
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

    const tasks = [
      { id: 'task.one', title: 'My first task', authorId: 'user.one' },
      { id: 'task.two', title: 'My second task', authorId: 'user.one' },
      { id: 'task.three', title: 'My third task', authorId: 'user.two' },
      { id: 'task.four', title: 'My fourth task', authorId: 'user.two' },
    ];

    await prisma.user.createMany({ data: users });
    await prisma.task.createMany({ data: tasks });
  });

  afterAll(async () => {
    jest.useRealTimers();

    const deleteTasks = prisma.task.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteTasks, deleteUsers]);

    await prisma.$disconnect();
  });

  describe('GET /', () => {
    it('should return unauthorized when user does not send token', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid token' });
    });

    it('should return unauthorized when user send an invalid token', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Cookie', ['token=invalid; Path=/']);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: 'Your token is invalid' });
    });

    it('should returns json content type with status code 200', async () => {
      const token = encode({ id: 'user.one', permissions: 0 });

      const response = await request(app)
        .get('/api/tasks')
        .set('Cookie', [`token=${token}`]);

      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    });

    it('should returns user tasks array', async () => {
      const token = encode({ id: 'user.one', permissions: 0 });

      const { body } = await request(app)
        .get('/api/tasks')
        .set('Cookie', [`token=${token}`]);

      expect(body).toEqual({ tasks: expect.any(Array) });
      expect(body.tasks).toEqual([
        {
          id: 'task.one',
          title: 'My first task',
          status: 'TODO',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: 'task.two',
          title: 'My second task',
          status: 'TODO',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });
  });

  describe('POST /', () => {
    it('should return unauthorized when user is not logged in', async () => {
      const response = await request(app).post('/api/tasks');

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid token' });
    });

    it('should returns 400 when request body is invalid', async () => {
      expect.assertions(4);

      const token = encode({ id: 'user.one', permissions: 0 });

      {
        const response = await request(app)
          .post('/api/tasks')
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
          .post('/api/tasks')
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

    it('must create the task and connect it to its author', async () => {
      const token = encode({ id: 'user.one', permissions: 0 });
      const input = { title: 'Make a cake' };

      const response = await request(app)
        .post('/api/tasks')
        .set('Cookie', [`token=${token}`])
        .send(input);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ message: 'Task successfully created' });

      const task = await prisma.task.findFirst({ where: input });

      expect(task).toEqual({
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
