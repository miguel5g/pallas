import { NotFoundError } from '../../errors';
import { prisma } from '../../libs/prisma';

class DeleteTaskService {
  /**
   * @param {string} id
   * @param {string} userId
   */
  async handler(id, userId) {
    const task = await prisma.task.findFirst({ where: { AND: [{ id }, { authorId: userId }] } });

    if (!task) {
      throw new NotFoundError('Task');
    }

    await prisma.task.delete({ where: { id } });
  }
}

export { DeleteTaskService };
