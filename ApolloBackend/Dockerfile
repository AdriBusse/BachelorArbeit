FROM node:14.16.1-alpine
WORKDIR /usr

COPY package.json ./
COPY tsconfig.json ./
COPY .env .
COPY ormconfig.json .
COPY src ./src
RUN npm install

EXPOSE 4000

CMD ["npm","run","dev"]

