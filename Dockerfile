FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder

# 声明构建参数，默认值为 http://api.autotest:5000（与 next.config.ts 默认值一致）
ARG API_PROXY_ORIGIN=http://api.autotest:5000
# 将构建参数设为环境变量，供 next build 使用
ENV API_PROXY_ORIGIN=$API_PROXY_ORIGIN

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER nextjs
EXPOSE 8080
CMD ["node", "server.js"]