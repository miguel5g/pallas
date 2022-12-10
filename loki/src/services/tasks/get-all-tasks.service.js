import { prisma } from '../../libs/prisma';

class GetAllTasksService {
  async handler(id) {
    const tasks = await prisma.task.findMany({
      where: {
        authorId: id,
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return tasks;
  }
}

export { GetAllTasksService };
