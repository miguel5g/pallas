import { jest } from '@jest/globals';

class TestPrismaKnowError extends Error {
  /** @type {string} */
  code;

  constructor(code) {
    super();

    this.code = code;
  }
}

jest.mock('@prisma/client', () => ({
  __esModule: true,
  Prisma: { PrismaClientKnownRequestError: TestPrismaKnowError },
}));

export { TestPrismaKnowError };
