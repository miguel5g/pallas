import { describe, expect, it } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

import { prisma } from './prisma';

describe('libs/prisma', () => {
  it('should returns a prisma client instance', () => {
    expect(prisma).toBeInstanceOf(PrismaClient);
  });
});
