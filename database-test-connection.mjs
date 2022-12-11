import { PrismaClient } from '@prisma/client';
import { exit } from 'process';

const prisma = new PrismaClient();

let globalTimeout, nexTryTimeout;

function connect() {
  prisma
    .$connect()
    .then(() => {
      clearTimeout(globalTimeout);
      clearTimeout(nexTryTimeout);
      console.log(`Connected to database on ${process.env.DATABASE_URL}`);
      exit();
    })
    .catch(() => {
      nexTryTimeout = setTimeout(() => {
        console.log(`Trying to connect again to database on ${process.env.DATABASE_URL}`);
        connect();
      }, 1000);
    });
}

connect();

globalTimeout = setTimeout(() => {
  clearTimeout(nexTryTimeout);
  console.log(`Unable to connect to database on ${process.env.DATABASE_URL}`);
  exit(1);
}, 10000);
