FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy all client code
COPY . .

# Declare and use the ARG
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

RUN npm install -g serve
EXPOSE 5173
CMD ["serve", "-s", "dist"]
