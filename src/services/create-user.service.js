import { Prisma } from '@prisma/client';

import { BadRequestError } from '../errors';
import { hashText } from '../libs/encryption';
import { prisma } from '../libs/prisma';

class CreateUserService {
  async handler({ name, surname, email, password }) {
    const hashedPassword = await hashText(password);

    try {
      await prisma.user.create({
        data: { name, surname, email, password: hashedPassword },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestError('Email already exists');
      }

      throw error;
    }
  }
}

export { CreateUserService };
