import { NotFoundError } from '../../errors';
import { prisma } from '../../libs/prisma';

class GetTaskByIdService {
  /**
   * @param {string} id
   */
  async handler(id, authorId) {
    const task = await prisma.task.findFirst({
      where: { id, authorId },
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
