import { jest } from '@jest/globals';

/** @type {import('express').Request} */
class TestRequest {
  body = {};
  query = {};
  params = {};
}

/** @type {import('express').Response} */
class TestResponse {
  json = jest.fn();

  status = jest.fn(() => this);
}

export { TestRequest, TestResponse };
