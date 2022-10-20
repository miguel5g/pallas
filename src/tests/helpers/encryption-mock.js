import { jest } from '@jest/globals';

jest.mock('../../libs/encryption', () => {
  return {
    __esModule: true,
    compareText: jest.fn(),
    hashText: jest.fn(),
  };
});
