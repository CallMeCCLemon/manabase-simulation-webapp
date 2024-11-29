# Use the official Node.js base image
FROM --platform=linux/amd64 node:22-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build the production build
RUN npm run build

FROM --platform=linux/amd64 node:22-alpine

WORKDIR /app

# Copy build output and node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules

COPY package.json ./

# Define the container's start command
EXPOSE 3000
CMD ["node", "build"]
