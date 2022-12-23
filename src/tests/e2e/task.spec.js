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

  describe('GET /:id', () => {
    it('should return unauthorized when user does not send token', async () => {
      const response = await request(app).get('/api/tasks/task.one');

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid token' });
    });

    it('should return unauthorized when user send an invalid token', async () => {
      const response = await request(app)
        .get('/api/tasks/task.one')
        .set('Cookie', ['token=invalid; Path=/']);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: 'Your token is invalid' });
    });

    it('should returns not found if task does not exists', async () => {
      const token = encode({ id: 'user.one', permissions: 0 });

      const response = await request(app)
        .get('/api/tasks/not-found')
        .set('Cookie', [`token=${token}`]);

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ message: 'Task not found' });
    });

    it('should returns json content type with status code 200', async () => {
      const token = encode({ id: 'user.one', permissions: 0 });

      const response = await request(app)
        .get('/api/tasks/task.one')
        .set('Cookie', [`token=${token}`]);

      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    });

    it('should returns requested task', async () => {
      const token = encode({ id: 'user.one', permissions: 0 });

      const { body } = await request(app)
        .get('/api/tasks/task.one')
        .set('Cookie', [`token=${token}`]);

      expect(body).toEqual({
        id: 'task.one',
        title: 'My first task',
        status: 'TODO',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
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

  describe('PATCH /:id', () => {
    const token = encode({ id: 'user.one', permissions: 0 });

    it('should return unauthorized when user is not logged in', async () => {
      const response = await request(app).patch('/api/tasks/task.one');

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid token' });
    });

    it('should return 404 when the task does not exist', async () => {
      const id = 'invalid';
      const input = { title: 'updated title' };

      const response = await request(app)
        .patch(`/api/tasks/${id}`)
        .set('Cookie', [`token=${token}`])
        .send(input);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task not found');
    });

    it('should return 404 when the task belongs to someone else', async () => {
      const id = 'task.three';
      const input = { title: 'updated title' };

      const response = await request(app)
        .patch(`/api/tasks/${id}`)
        .set('Cookie', [`token=${token}`])
        .send(input);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task not found');
    });

    it('should return 400 if send an empty request body', async () => {
      const id = 'task.one';
      const input = {};

      const response = await request(app)
        .patch(`/api/tasks/${id}`)
        .set('Cookie', [`token=${token}`])
        .send(input);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid request body');
    });

    it('should return 422 if send an invalid task status', async () => {
      const id = 'task.one';
      const input = { status: 'INVALID' };

      const response = await request(app)
        .patch(`/api/tasks/${id}`)
        .set('Cookie', [`token=${token}`])
        .send(input);

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('message', 'Invalid task status');
    });

    it('should update task on database', async () => {
      const id = 'task.one';
      const input = { status: 'DOING' };

      const response = await request(app)
        .patch(`/api/tasks/${id}`)
        .set('Cookie', [`token=${token}`])
        .send(input);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Task successfully updated');

      const task = await prisma.task.findUnique({ where: { id } });

      expect(task).toEqual({
        id: 'task.one',
        title: 'My first task',
        authorId: 'user.one',
        status: 'DOING',
        updatedAt: expect.any(Date),
        createdAt: expect.any(Date),
      });
    });
  });

  describe('DELETE /:id', () => {
    const token = encode({ id: 'user.one', permissions: 0 });

    it('should return unauthorized when user is not logged in', async () => {
      const response = await request(app).delete('/api/tasks/task.one');

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid token' });
    });

    it('should return 404 when the task does not exist', async () => {
      const id = 'not exists';

      const response = await request(app)
        .delete(`/api/tasks/${id}`)
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task not found');
    });

    it('should return 404 when the task belongs to someone else', async () => {
      const id = 'task.three';

      const response = await request(app)
        .delete(`/api/tasks/${id}`)
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task not found');
    });

    it('should delete task on database', async () => {
      const id = 'task.one';

      const response = await request(app)
        .delete(`/api/tasks/${id}`)
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Task successfully deleted');

      const task = await prisma.task.findUnique({ where: { id } });

      expect(task).toBe(null);
    });
  });
});
