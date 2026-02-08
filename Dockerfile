# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Copy built application
COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./

# Set environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=10000

# Expose port (Render uses 10000 by default)
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:10000/api/health || exit 1

# Run the app
CMD ["node", ".output/server/index.mjs"]
