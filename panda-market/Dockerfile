ARG NODE_VERSION
# local version = 22.16.0
FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY . /app/

RUN npm ci

RUN npm run build

ENTRYPOINT [ "npm", "run", "start" ]
