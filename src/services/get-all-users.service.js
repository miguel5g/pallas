import { prisma } from '../libs/prisma';

class GetAllUsersService {
  constructor() {}

  async handler(page) {
    const validPage = Math.trunc(Math.max(1, +page)) || 1;

    const countQuery = prisma.user.count();
    const usersQuery = prisma.user.findMany({
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

    const [count, users] = await Promise.all([countQuery, usersQuery]);

    return {
      page: validPage,
      totalUsers: count,
      totalPages: Math.ceil(count / 20),
      perPage: 20,
      users,
    };
  }
}

export { GetAllUsersService };
