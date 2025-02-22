# frontend/Dockerfile

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Build the Next.js app
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy the built app from the builder stage
COPY --from=builder /app ./

# Expose the port your Next.js app runs on
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run", "dev"]
