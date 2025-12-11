# Multi-stage build for Telegram Bot with AI Agent

# Stage 1: Build
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/mcp-tools/package.json ./packages/mcp-tools/
COPY apps/agent/package.json ./apps/agent/
COPY apps/backend-api/package.json ./apps/backend-api/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages ./packages
COPY apps ./apps

# Build TypeScript code
RUN pnpm -r run build

# Stage 2: Production
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/mcp-tools/package.json ./packages/mcp-tools/
COPY apps/agent/package.json ./apps/agent/
COPY apps/backend-api/package.json ./apps/backend-api/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built files from builder
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/mcp-tools/dist ./packages/mcp-tools/dist
COPY --from=builder /app/apps/agent/dist ./apps/agent/dist
COPY --from=builder /app/apps/backend-api/dist ./apps/backend-api/dist

# Copy source files needed for runtime
COPY apps/backend-api/src ./apps/backend-api/src
COPY apps/agent/src ./apps/agent/src

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "apps/backend-api/src/index.ts"]
