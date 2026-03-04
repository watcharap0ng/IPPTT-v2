import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { ProvisionService } from './service.js'

export async function provisionRoutes(app: FastifyInstance) {
  const service = new ProvisionService()

  app.addHook('preHandler', app.authenticate)

  app.get('/profiles', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { page?: number; limit?: number }
    const data = await service.listProfiles(query)
    return reply.send({ success: true, ...data })
  })

  app.get('/profiles/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const data = await service.getProfile(id)
    return reply.send({ success: true, data })
  })

  app.post('/profiles', {
    preHandler: [app.authorize(['admin'])],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as any
    body.createdBy = (request.user as any).id
    const data = await service.createProfile(body)
    return reply.code(201).send({ success: true, data })
  })

  app.put('/profiles/:id', {
    preHandler: [app.authorize(['admin'])],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const data = await service.updateProfile(id, request.body)
    return reply.send({ success: true, data })
  })

  app.delete('/profiles/:id', {
    preHandler: [app.authorize(['admin'])],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    await service.deleteProfile(id)
    return reply.send({ success: true, message: 'Profile deactivated' })
  })

  app.post('/execute', {
    preHandler: [app.authorize(['admin', 'operator'])],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId, deviceImei, overrides } = request.body as {
      profileId: string
      deviceImei: string
      overrides?: Record<string, string>
    }
    const data = await service.provisionDevice(profileId, deviceImei, overrides)
    return reply.send({ success: true, data })
  })

  app.get('/logs', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { profileId?: string; deviceImei?: string; page?: number; limit?: number }
    const data = await service.getLogs(query)
    return reply.send({ success: true, ...data })
  })
}
