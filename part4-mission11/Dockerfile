FROM node:18

COPY . /app

WORKDIR /app

RUN npm ci && npm run build

ENV PORT=3000

ENTRYPOINT [ "npm", "run", "start" ]