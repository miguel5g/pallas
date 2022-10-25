import { NotFoundError, UnauthorizedError } from '../errors';
import { compareText } from '../libs/encryption';
import { prisma } from '../libs/prisma';
import { encode } from '../libs/token';

class CreateAuthSession {
  async handler(email, password) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        permissions: true,
      },
    });

    if (!user) throw new NotFoundError('User');

    const isValid = await compareText(user.password, password);

    if (!isValid) throw new UnauthorizedError('Passwords do not match');

    return encode({ id: user.id, permissions: user.permissions });
  }
}

export { CreateAuthSession };
