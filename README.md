# IPPTT v2

IP Push-To-Talk — Voice Communication & IoT Device Management Platform

## Stack

- **Frontend**: Nuxt 3 + Vue 3 + Tailwind CSS + Shadcn/Vue
- **Backend**: Fastify 5 + TypeScript + Mongoose
- **Database**: MongoDB 7
- **Voice**: Mumble/Murmur + Python REST wrapper (ZeroC ICE)
- **IoT**: MQTT 5 (Eclipse Mosquitto)
- **GPS**: Traccar
- **Monorepo**: pnpm workspaces + Turborepo

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Or use Docker
docker compose up -d
```

## Project Structure

```
apps/
  frontend/      # Nuxt 3 web application
  backend/       # Fastify API server
  murmur-rest/   # Python REST wrapper for Murmur voice server
packages/
  shared/        # Shared types, constants, utilities
config/
  mosquitto/     # MQTT broker config
  murmur/        # Voice server config
  traccar/       # GPS tracker config
docker/          # Dockerfiles and nginx config
```

## Services

| Service    | Port  | Description              |
|------------|-------|--------------------------|
| Frontend   | 3000  | Nuxt 3 web app           |
| Backend    | 3001  | Fastify API              |
| Murmur     | 64738 | Mumble voice server      |
| Murmur REST| 5000  | Voice API wrapper         |
| Mosquitto  | 1883  | MQTT broker              |
| Traccar    | 8082  | GPS tracking             |
| MongoDB    | 27017 | Database                 |
| Nginx      | 80    | Reverse proxy            |

## Environment

Copy `.env.example` to `.env` and configure your settings.
