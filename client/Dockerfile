FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the code and build
COPY . .
RUN npm run build

# Stage 2: Serve the application with Vite Preview
FROM node:22-alpine

WORKDIR /app

# Copy built assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Install vite globally to use for preview
RUN npm install -g vite

EXPOSE 4173

# Run vite preview on all interfaces
CMD ["vite", "preview", "--host", "0.0.0.0"]
