# fe/client_app/Dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy toàn bộ project và build
COPY . .
RUN npm run build

# =========================
# 2. Base image for running
# =========================
FROM node:22-alpine AS runner

WORKDIR /app

# Tạo biến NODE_ENV là production
ENV NODE_ENV=production

# Cài serve runtime dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/next.config.js ./
# COPY --from=builder /app/tsconfig.json ./ # nếu dùng TypeScript

# Mặc định port Next.js
EXPOSE 3000

# Start Next.js app
CMD ["npm", "start"]
