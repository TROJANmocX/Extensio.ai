# Base runtime environment
FROM node:20-alpine

# Set working context
WORKDIR /usr/src/app

# Install caching dependencies
COPY package*.json ./
RUN npm ci --quiet

# Copy core configurations and source structures
COPY . .

# Build production application bundle
RUN npm run build

# Expose running port
EXPOSE 3000

# Set running environments
ENV PORT=3000
ENV NODE_ENV=production

# Boot target web server
CMD ["npm", "start"]
