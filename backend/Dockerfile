# ========================================================
# DOBATO Backend - Multi-Stage Production Dockerfile
# ========================================================

# --------------------------------------------------------
# Stage 1: Build & Compile
# --------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for OpenSSL detection and native compilation
RUN apk add --no-cache openssl libc6-compat

# Install node dependencies
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

# Install runtime OpenSSL 3.x, libc6 compatibility, and CA certificates for MongoDB Atlas TLS
RUN apk add --no-cache openssl libc6-compat ca-certificates

# Run as non-root user for security
USER node

# Copy production artifacts
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
