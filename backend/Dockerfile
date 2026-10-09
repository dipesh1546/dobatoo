# ========================================================
# DOBATO Backend - Multi-Stage Production Dockerfile
# ========================================================

# --------------------------------------------------------
# Stage 1: Build & Compile
# --------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Generate Prisma Client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Copy source and build
COPY tsconfig*.json nest-cli.json ./
COPY src ./src/

RUN npm run build

# Prune devDependencies for production
RUN npm prune --production

# --------------------------------------------------------
# Stage 2: Minimal Production Image
# --------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Run as non-root user for security
USER node

# Copy production artifacts
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
