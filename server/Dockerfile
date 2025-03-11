# Use an official Node.js runtime
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Install PostgreSQL client and netcat for health checks
RUN apk add --no-cache postgresql-client netcat-openbsd

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the backend port
EXPOSE 5000

# Run the backend server
CMD ["npm", "run", "dev"]