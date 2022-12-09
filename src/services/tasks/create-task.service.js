import { prisma } from '../../libs/prisma';

class CreateTaskService {
  async handler({ title, authorId }) {
    await prisma.task.create({
      data: {
        title,
        authorId,
      },
    });
  }
}

export { CreateTaskService };
