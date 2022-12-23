import { jest } from '@jest/globals';

jest.mock('../../libs/token', () => ({
  __esModule: true,
  decode: jest.fn(),
  encode: jest.fn(),
}));
