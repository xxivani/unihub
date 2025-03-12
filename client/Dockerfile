# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the frontend code
COPY . .

# 1) Declare a build ARG
ARG VITE_API_URL
# 2) Export that ARG as an ENV var so that Vite can read it at build time
ENV VITE_API_URL=$VITE_API_URL

# Build the frontend (this is where Vite will read VITE_API_URL)
RUN npm run build

# Install a lightweight web server
RUN npm install -g serve

# Expose the frontend port (Vite uses 5173 by default, or 80 if you prefer)
EXPOSE 5173

# Serve the built frontend
CMD ["serve", "-s", "dist"]
