# Stage 1
FROM node:16 AS builder

WORKDIR /app

COPY ./package* ./

RUN npm ci

COPY ./src ./src

COPY .swcrc.build ./

RUN npm run build

COPY ./prisma ./prisma

RUN npx prisma generate

# Stage 2
FROM node:16 AS release

WORKDIR /app

COPY ./package* ./

RUN npm ci --omit=dev

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=builder /app/dist ./dist

CMD ["npm", "run", "start"]
