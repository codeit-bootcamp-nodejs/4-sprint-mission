FROM node:20

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

VOLUME /app/uploads

EXPOSE 3000

CMD ["npm", "run", "start"]
