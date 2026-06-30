FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency configuration
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy source code files
COPY . .

# Set Environment Variables
ENV PORT=8000
ENV NODE_ENV=production

# Expose API Port
EXPOSE 8000

# Start Express application
CMD ["npm", "start"]
