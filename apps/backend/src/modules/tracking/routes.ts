import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { TrackingService } from './service.js'

export async function trackingRoutes(app: FastifyInstance) {
  const trackingService = new TrackingService()

  app.addHook('preHandler', app.authenticate)

  app.get('/devices', async (_request: FastifyRequest, reply: FastifyReply) => {
    const data = await trackingService.getDevices()
    return reply.send({ success: true, data })
  })

  app.get('/devices/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const data = await trackingService.getDevice(parseInt(id, 10))
    return reply.send({ success: true, data })
  })

  app.get('/positions', async (request: FastifyRequest, reply: FastifyReply) => {
    const { deviceId } = request.query as { deviceId?: string }
    const data = await trackingService.getPositions(
      deviceId ? parseInt(deviceId, 10) : undefined
    )
    return reply.send({ success: true, data })
  })

  app.get('/route', async (request: FastifyRequest, reply: FastifyReply) => {
    const { deviceId, from, to } = request.query as {
      deviceId: string
      from: string
      to: string
    }
    const data = await trackingService.getRoute(parseInt(deviceId, 10), from, to)
    return reply.send({ success: true, data })
  })

  app.get('/geofences', async (_request: FastifyRequest, reply: FastifyReply) => {
    const data = await trackingService.getGeofences()
    return reply.send({ success: true, data })
  })
}
