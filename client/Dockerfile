FROM node:18-alpine

WORKDIR /usr/src/home/client

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5173