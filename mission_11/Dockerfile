FROM node:20-slim AS builder
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY . .

RUN npm install

RUN npx prisma generate

RUN npm run build

# ----------------------------------------

FROM node:20-slim
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

VOLUME /usr/src/app/uploads

CMD ["node", "dist/main.js"]
