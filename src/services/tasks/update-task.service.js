import { Prisma } from '@prisma/client';

import { NotFoundError } from '../../errors';
import { prisma } from '../../libs/prisma';

class UpdateTaskService {
  async handler({ id, ...data }) {
    try {
      prisma.task.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError('Task');
      }

      throw error;
    }
  }
}

export { UpdateTaskService };
