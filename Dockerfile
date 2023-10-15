FROM fascinated/docker-images:node-pnpm-latest AS base

# Install depends
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json* pnpm-lock.yaml* ./
RUN pnpm install --production --frozen-lockfile --quiet

# Build from source
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm build

# Run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./.next/static

RUN npm i -g @beam-australia/react-env

USER nextjs
EXPOSE 3000
ENV HOSTNAME "0.0.0.0"
ENV PORT 3000
CMD npx react-env --env APP_ENV && pnpm start