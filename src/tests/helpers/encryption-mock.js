import { jest } from '@jest/globals';

jest.mock('../../libs/encryption', () => ({
  __esModule: true,
  compareText: jest.fn(),
  hashText: jest.fn(),
}));
