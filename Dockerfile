FROM node:slim
EXPOSE 8080

COPY src /app
WORKDIR /app

RUN npm install
RUN npm audit fix

CMD ["node","server.js"]