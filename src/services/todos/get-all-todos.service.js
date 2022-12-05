import { prisma } from '../../libs/prisma';

class GetAllTodosService {
  async handler(id) {
    const todos = await prisma.todo.findMany({
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

    return todos;
  }
}

export { GetAllTodosService };
