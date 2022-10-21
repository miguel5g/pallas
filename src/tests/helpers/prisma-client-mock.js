import { jest } from '@jest/globals';

jest.mock('@prisma/client', () => {
  return {
    __esModule: true,
    Prisma: {
      PrismaClientKnownRequestError: TestPrismaKnowError,
    },
  };
});

class TestPrismaKnowError extends Error {
  /** @type {string} */
  code;

  constructor(code) {
    super();

    this.code = code;
  }
}

export { TestPrismaKnowError };
