# Multi-stage build for production

# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY .nvmrc ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Install wrangler globally
RUN npm install -g wrangler

# Copy built application and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/wrangler.toml ./
COPY --from=builder /app/worker ./worker

# Expose port (for local testing)
EXPOSE 8787

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8787/api/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Run the application
CMD ["wrangler", "dev", "--local", "--port", "8787"]