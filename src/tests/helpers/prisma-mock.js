import { jest } from '@jest/globals';

jest.mock('../../libs/prisma', () => {
  return {
    __esModule: true,
    prisma: {
      user: {
        findMany: jest.fn(),
      },
    },
  };
});
