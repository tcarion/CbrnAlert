FROM rockylinux:9 AS build-stage

# Install Node.js (v18), Java 11, and other dependencies
RUN dnf update -y && \
    dnf install -y \
    nodejs \
    java-11-openjdk \
    java-11-openjdk-devel \
    nginx \
    # git \
    # curl \
    wget \
    && dnf clean all

# Verify installations
RUN node --version && \
    npm --version && \
    java -version && \
    nginx -version

# Set working directory
WORKDIR /app/frontend

# Copy package files first for better caching
COPY frontend/package*.json ./

# Install dependencies
RUN npm install --force

# Copy application code or clone from GitHub
COPY frontend /app/frontend/
COPY api /app/api

# Replace the API URL for the docker environment specific URL
RUN sed -i -e "s@const rootApiUrl.*@const rootApiUrl = ''@g" src/environments/environment.prod.ts

RUN npm run build

# Production stage with nginx
FROM nginx:1.24-alpine AS production-stage

# Install curl for health checks (optional)
RUN apk add --no-cache curl

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app to nginx serving directory
COPY --from=build-stage /app/frontend/dist/ /usr/share/nginx/html

# Copy custom nginx configuration
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#     CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]