FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client netcat-openbsd

COPY package*.json .sequelizerc ./
RUN npm install

COPY . .

EXPOSE 5001

CMD ["npm","run","dev"]
