# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the frontend code
COPY . .

# Build the frontend
RUN npm run build

# Install a lightweight web server
RUN npm install -g serve

# Expose the frontend port (Vite uses 5173)
EXPOSE 5173

# Serve the built frontend
CMD ["serve", "-s", "dist"]
