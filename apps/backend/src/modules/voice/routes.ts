import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { VoiceService } from './service.js'

export async function voiceRoutes(app: FastifyInstance) {
  const voiceService = new VoiceService()

  // All voice routes require authentication
  app.addHook('preHandler', app.authenticate)

  app.get('/servers', async (_request: FastifyRequest, reply: FastifyReply) => {
    const data = await voiceService.getServers()
    return reply.send({ success: true, data })
  })

  app.get('/servers/:serverId/channels', async (request: FastifyRequest, reply: FastifyReply) => {
    const { serverId } = request.params as { serverId: string }
    const data = await voiceService.getChannels(parseInt(serverId, 10))
    return reply.send({ success: true, data })
  })

  app.get('/servers/:serverId/users', async (request: FastifyRequest, reply: FastifyReply) => {
    const { serverId } = request.params as { serverId: string }
    const data = await voiceService.getUsers(parseInt(serverId, 10))
    return reply.send({ success: true, data })
  })

  app.get('/servers/:serverId/tree', async (request: FastifyRequest, reply: FastifyReply) => {
    const { serverId } = request.params as { serverId: string }
    const data = await voiceService.getTree(parseInt(serverId, 10))
    return reply.send({ success: true, data })
  })

  app.get('/health', async (_request: FastifyRequest, reply: FastifyReply) => {
    const data = await voiceService.getHealth()
    return reply.send({ success: true, data })
  })
}
