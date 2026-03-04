import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { TalkgroupService } from './service.js'
import { z } from 'zod'

const createTalkgroupSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  channels: z.array(z.object({
    number: z.number(),
    name: z.string(),
    frequency: z.string().optional(),
    rxFrequency: z.string().optional(),
    txFrequency: z.string().optional(),
    colorCode: z.number().optional(),
    timeSlot: z.number().optional(),
    contactName: z.string().optional(),
  })).default([]),
})

export async function talkgroupRoutes(app: FastifyInstance) {
  const service = new TalkgroupService()

  app.addHook('preHandler', app.authenticate)

  app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { page?: number; limit?: number }
    const data = await service.list(query)
    return reply.send({ success: true, ...data })
  })

  app.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const data = await service.getById(id)
    return reply.send({ success: true, data })
  })

  app.post('/', {
    preHandler: [app.authorize(['admin', 'operator'])],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createTalkgroupSchema.parse(request.body)
    const data = await service.create({
      ...body,
      createdBy: (request.user as any).id,
    } as any)
    return reply.code(201).send({ success: true, data })
  })

  app.put('/:id', {
    preHandler: [app.authorize(['admin', 'operator'])],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const data = await service.update(id, request.body as any)
    return reply.send({ success: true, data })
  })

  app.delete('/:id', {
    preHandler: [app.authorize(['admin'])],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    await service.delete(id)
    return reply.send({ success: true, message: 'Talkgroup deactivated' })
  })

  app.get('/:id/xml', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const xml = await service.exportXml(id)
    return reply.header('Content-Type', 'application/xml').send(xml)
  })

  app.post('/import', {
    preHandler: [app.authorize(['admin', 'operator'])],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { xml } = request.body as { xml: string }
    const data = await service.importXml(xml, (request.user as any).id)
    return reply.code(201).send({ success: true, data })
  })
}
