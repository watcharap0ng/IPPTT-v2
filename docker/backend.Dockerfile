FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile || pnpm install

# Build
FROM deps AS build
WORKDIR /app
COPY tsconfig.base.json ./
COPY packages/shared/ ./packages/shared/
COPY apps/backend/ ./apps/backend/
RUN pnpm --filter @ipptt/backend build

# Production — keep pnpm structure intact
FROM base AS runner
WORKDIR /app
COPY --from=build /app ./

ENV HOST=0.0.0.0
ENV PORT=3001
EXPOSE 3001

CMD ["node", "apps/backend/dist/index.js"]
