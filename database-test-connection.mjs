import retry from 'retry';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function connect() {
  const connection = retry.operation({
    factor: 3,
    retries: 10,
    maxTimeout: 30 * 1000,
  });

  connection.attempt((currentAttempt) => {
    console.log(`Trying to connect to database (attempt ${currentAttempt})`);

    prisma
      .$connect()
      .then(() => console.log('Successfully connected'))
      .catch((error) => connection.retry(error));
  });
}

connect();
