FROM node:18-alpine

WORKDIR /usr/src/home

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
