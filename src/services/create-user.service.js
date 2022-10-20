import { prisma } from '../libs/prisma';

class CreateUserService {
  async handler({ name, surname, email, password }) {
    await prisma.user.create({
      data: { name, surname, email, password },
    });
  }
}

export { CreateUserService };
