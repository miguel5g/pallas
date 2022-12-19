import { NotFoundError } from '../../errors';
import { prisma } from '../../libs/prisma';

class GetTaskByIdService {
  /**
   * @param {string} id
   */
  async handler(id) {
    const task = await prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!task) {
      throw new NotFoundError('Task');
    }

    return task;
  }
}

export { GetTaskByIdService };
