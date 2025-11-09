# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package.json only (package-lock.json is excluded via .dockerignore)
COPY package.json ./

# Fresh install without lock file - properly handles optional dependencies like Rollup binaries
RUN npm install && npm cache clean --force

# Copy source code
COPY . .

# Build argument for API URL
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
