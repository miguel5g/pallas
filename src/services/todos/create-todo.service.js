import { prisma } from '../../libs/prisma';

class CreateTodoService {
  async handler({ title, authorId }) {
    await prisma.todo.create({
      data: {
        title,
        authorId,
      },
    });
  }
}

export { CreateTodoService };
