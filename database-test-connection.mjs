import retry from 'retry';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const MAX_TRIES = 10;

function connect() {
  const connection = retry.operation({
    factor: 3,
    retries: MAX_TRIES,
    maxTimeout: 30 * 1000,
  });

  function exitWithErro() {
    if (connection.attempts() === MAX_TRIES + 1) {
      console.log('Unable to connect to database');
      process.exit(1);
    }
  }

  connection.attempt((currentAttempt) => {
    console.log(`Trying to connect to database (attempt ${currentAttempt})`);

    prisma
      .$connect()
      .then(() => console.log('Successfully connected'))
      .catch((error) => {
        exitWithErro();
        connection.retry(error);
      });
  });
}

connect();
