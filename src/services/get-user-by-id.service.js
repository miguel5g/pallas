import { NotFoundError } from '../errors';
import { prisma } from '../libs/prisma';

class GetUserByIdService {
  async handler(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        surname: true,
        permissions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new NotFoundError('User');

    return user;
  }
}

export { GetUserByIdService };
