import { NotFoundError } from '../../errors';
import { prisma } from '../../libs/prisma';

class UpdateTaskService {
  async handler({ id, userId, ...data }) {
    const task = await prisma.task.findFirst({ where: { AND: [{ id }, { authorId: userId }] } });

    if (task === null) {
      throw new NotFoundError('Task');
    }

    await prisma.task.update({ where: { id }, data });
  }
}

export { UpdateTaskService };
