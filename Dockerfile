# Engine stages might be removed after it's published to NPM
FROM node:18-alpine AS engine-deps
WORKDIR /engine
COPY packages/engine/package.json engine/yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:18-alpine AS engine-builder
WORKDIR /engine
COPY packages/engine/ .
COPY --from=engine-deps /engine/node_modules ./node_modules
RUN yarn build

# Install dependencies only when needed
FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=engine-builder /engine/package.json /engine/yarn.lock ../engine/
COPY --from=engine-builder /engine/dist/ ../engine/dist
COPY packages/web-ui/package.json web-ui/yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
COPY packages/web-ui .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=engine-builder /engine/package.json /engine/yarn.lock ../engine/
COPY --from=engine-builder /engine/dist/ ../engine/dist
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

ENV STORAGE_DIR /app/.investool-data/storage

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node_modules/.bin/next", "start"]