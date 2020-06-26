FROM node:slim
EXPOSE 8080
EXPOSE 8081

COPY src /app
WORKDIR /app

RUN npm install
RUN npm audit fix

CMD ["node","app.js"]