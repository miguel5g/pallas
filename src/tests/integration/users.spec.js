import request from 'supertest';
import { describe, expect, it } from '@jest/globals';

import { appFactory } from '../../app';

describe('/api/users', () => {
  const app = appFactory();

  /** @todo: create users test seed */

  describe('GET /', () => {
    it('should return json body with status code 200', async () => {
      const response = await request(app).get('/api/users');

      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    });
  });
});
