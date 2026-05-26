# Base runtime environment
FROM node:20-alpine

# Set working context
WORKDIR /usr/src/app

# Install caching dependencies
COPY package*.json ./
RUN npm ci --quiet

# Copy core configurations and source structures
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript production builds
RUN npm run build

# Prune dev-dependencies to optimize container weights
RUN npm prune --production

# Expose mapping port
EXPOSE 5000

# Set running environments
ENV PORT=5000
ENV NODE_ENV=production

# Boot target service
CMD ["npm", "start"]
