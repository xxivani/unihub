FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client netcat-openbsd

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]