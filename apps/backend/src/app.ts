import Fastify from 'fastify'
import cors from '@fastify/cors'
import { connectDB } from './plugins/mongodb.js'
import authPlugin from './plugins/auth.js'
import { authRoutes } from './modules/auth/routes.js'
import { userRoutes } from './modules/users/routes.js'
import { voiceRoutes } from './modules/voice/routes.js'
import { deviceRoutes } from './modules/mqtt/routes.js'
import { initMqttClient } from './modules/mqtt/mqtt-client.js'
import { trackingRoutes } from './modules/tracking/routes.js'
import { talkgroupRoutes } from './modules/talkgroups/routes.js'
import { provisionRoutes } from './modules/provision/routes.js'

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  })

  // Plugins
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
  await app.register(authPlugin)

  // Database
  await connectDB()

  // MQTT client
  await initMqttClient().catch((err) => {
    app.log.warn('MQTT init failed (non-fatal):', err)
  })

  // Error handler for Zod validation
  app.setErrorHandler((error: Error & { statusCode?: number; issues?: unknown[] }, request, reply) => {
    if (error.name === 'ZodError') {
      return reply.code(400).send({
        success: false,
        error: 'Validation error',
        details: error.issues,
      })
    }
    if (error.statusCode) {
      return reply.code(error.statusCode).send({
        success: false,
        error: error.message,
      })
    }
    request.log.error(error)
    return reply.code(500).send({ success: false, error: 'Internal server error' })
  })

  // Health check
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  // API routes
  await app.register(authRoutes, { prefix: '/api/auth' })
  await app.register(userRoutes, { prefix: '/api/users' })
  await app.register(voiceRoutes, { prefix: '/api/voice' })
  await app.register(deviceRoutes, { prefix: '/api/devices' })
  await app.register(trackingRoutes, { prefix: '/api/tracking' })
  await app.register(talkgroupRoutes, { prefix: '/api/talkgroups' })
  await app.register(provisionRoutes, { prefix: '/api/provision' })

  return app
}
