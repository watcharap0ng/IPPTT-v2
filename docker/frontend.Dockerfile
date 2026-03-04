FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile || pnpm install

# Build
FROM deps AS build
WORKDIR /app
COPY tsconfig.base.json ./
COPY packages/shared/ ./packages/shared/
COPY apps/frontend/ ./apps/frontend/
RUN pnpm --filter @ipptt/frontend build

# Production
FROM base AS runner
WORKDIR /app
COPY --from=build /app/apps/frontend/.output ./.output

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
