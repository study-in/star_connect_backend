# Dockerfile for Node.js TypeScript Application

# --- Base Stage ---
# Use a specific Node.js LTS version (Alpine for smaller image size)
FROM node:18-alpine As base
WORKDIR /app

# --- Dependencies Stage ---
FROM base AS dependencies
# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json package-lock.json* yarn.lock* ./
# Install production dependencies only
RUN npm ci --omit=dev --ignore-scripts
# If you have native dependencies needing build tools:
# RUN apk add --no-cache python3 make g++

# --- Build Stage ---
FROM base AS build
WORKDIR /app
# Copy dependency manifests
COPY package.json package-lock.json* yarn.lock* ./
# Install ALL dependencies (including devDependencies) needed for build
RUN npm ci --ignore-scripts
# Copy application source code
COPY . .
# Build TypeScript to JavaScript
RUN npm run build

# --- Production Stage ---
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
# Copy production dependencies from the 'dependencies' stage
COPY --from=dependencies /app/node_modules ./node_modules
# Copy built application code from the 'build' stage
COPY --from=build /app/dist ./dist
# Copy package.json (needed for running start script if it uses it)
COPY package.json .
# Copy assets like views and public if they are NOT built into dist
COPY views ./views
COPY public ./public
# Copy cert directory if using self-signed certs within the image (not recommended for prod)
# COPY cert ./cert

# Expose the port the app runs on (should match PORT in .env)
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]
# Or directly: CMD ["node", "dist/server.js"]
