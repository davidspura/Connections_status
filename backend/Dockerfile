FROM node:current-slim

WORKDIR /usr/src/app

COPY package.json ./backend/

RUN npm install

EXPOSE 8080

CMD [ "npm", "start" ]

COPY . .