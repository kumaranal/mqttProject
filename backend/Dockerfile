# backend/Dockerfile

FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the application code
COPY . .

# Expose the port your Express app runs on
EXPOSE 4000

# Start the Express server
CMD ["npm", "run", "dev"]
