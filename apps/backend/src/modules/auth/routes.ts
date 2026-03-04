import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from './service.js'
import { loginSchema, registerSchema, refreshSchema } from './schemas.js'

export async function authRoutes(app: FastifyInstance) {
  const authService = new AuthService(app)

  app.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = loginSchema.parse(request.body)
    const result = await authService.login(body)
    return reply.send({ success: true, data: result })
  })

  app.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = registerSchema.parse(request.body)
    const result = await authService.register(body)
    return reply.code(201).send({ success: true, data: result })
  })

  app.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = refreshSchema.parse(request.body)
    const result = await authService.refresh(body.refreshToken)
    return reply.send({ success: true, data: result })
  })

  app.post('/logout', {
    preHandler: [app.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { refreshToken } = (request.body as { refreshToken?: string }) || {}
    await authService.logout((request.user as any).id, refreshToken)
    return reply.send({ success: true, message: 'Logged out' })
  })

  app.get('/me', {
    preHandler: [app.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ success: true, data: request.user })
  })
}
