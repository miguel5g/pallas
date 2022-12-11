FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY src ./src

COPY .swcrc.build ./

RUN npm run build

COPY ./prisma ./prisma

RUN npx prisma generate

CMD [ "npm", "run", "start" ]
