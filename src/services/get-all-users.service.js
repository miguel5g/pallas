import { prisma } from '../libs/prisma';

class GetAllUsersService {
  constructor() {}

  async handler(page) {
    const validPage = Math.trunc(Math.max(1, +page)) || 1;

    return prisma.user.findMany({
      skip: (validPage - 1) * 20,
      take: 20,
      select: {
        id: true,
        name: true,
        surname: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

export { GetAllUsersService };
