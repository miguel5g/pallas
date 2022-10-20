import { hashText } from '../libs/encryption';
import { prisma } from '../libs/prisma';

class CreateUserService {
  async handler({ name, surname, email, password }) {
    const hashedPassword = await hashText(password);

    await prisma.user.create({
      data: { name, surname, email, password: hashedPassword },
    });
  }
}

export { CreateUserService };
