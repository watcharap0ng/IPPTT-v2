import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { DeviceService } from './service.js'
import { z } from 'zod'

const createDeviceSchema = z.object({
  name: z.string().min(1),
  imei: z.string().min(1),
  type: z.enum(['radio', 'gps-tracker', 'iot-sensor']).default('radio'),
  userId: z.string().optional(),
})

export async function deviceRoutes(app: FastifyInstance) {
  const deviceService = new DeviceService()

  app.addHook('preHandler', app.authenticate)

  app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { page?: number; limit?: number; status?: string; type?: string }
    const data = await deviceService.list(query)
    return reply.send({ success: true, ...data })
  })

  app.get('/stats', async (_request: FastifyRequest, reply: FastifyReply) => {
    const stats = await deviceService.getStats()
    return reply.send({ success: true, data: stats })
  })

  app.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const device = await deviceService.getById(id)
    return reply.send({ success: true, data: device })
  })

  app.post('/', {
    preHandler: [app.authorize(['admin', 'operator'])],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createDeviceSchema.parse(request.body)
    const device = await deviceService.create(body as any)
    return reply.code(201).send({ success: true, data: device })
  })

  app.put('/:id', {
    preHandler: [app.authorize(['admin', 'operator'])],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const device = await deviceService.update(id, request.body as any)
    return reply.send({ success: true, data: device })
  })

  app.delete('/:id', {
    preHandler: [app.authorize(['admin'])],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    await deviceService.delete(id)
    return reply.send({ success: true, message: 'Device deactivated' })
  })

  app.post('/:id/command', {
    preHandler: [app.authorize(['admin', 'operator'])],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const command = request.body as Record<string, unknown>
    const result = await deviceService.sendCommand(id, command)
    return reply.send({ success: true, data: result })
  })
}
