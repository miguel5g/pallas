import { prisma } from '../libs/prisma';

class GetAllUsersService {
  constructor() {}

  async handler() {
    prisma.user.findMany();
  }
}

export { GetAllUsersService };
