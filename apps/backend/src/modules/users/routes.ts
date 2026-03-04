import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { User } from './model.js'

export async function userRoutes(app: FastifyInstance) {
  // All user routes require authentication
  app.addHook('preHandler', app.authenticate)

  app.get('/', {
    preHandler: [app.authorize(['admin'])],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { page = 1, limit = 20 } = request.query as { page?: number; limit?: number }
    const skip = (Number(page) - 1) * Number(limit)

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      User.countDocuments(),
    ])

    return reply.send({
      success: true,
      data: users,
      total,
      page: Number(page),
      limit: Number(limit),
    })
  })

  app.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const user = await User.findById(id)
    if (!user) {
      return reply.code(404).send({ success: false, error: 'User not found' })
    }
    return reply.send({ success: true, data: user })
  })

  app.put('/:id', {
    preHandler: [app.authorize(['admin'])],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const updates = request.body as Record<string, unknown>

    // Prevent password/role changes via this endpoint
    delete updates.password
    delete updates.role

    const user = await User.findByIdAndUpdate(id, updates, { new: true })
    if (!user) {
      return reply.code(404).send({ success: false, error: 'User not found' })
    }
    return reply.send({ success: true, data: user })
  })

  app.delete('/:id', {
    preHandler: [app.authorize(['admin'])],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true })
    if (!user) {
      return reply.code(404).send({ success: false, error: 'User not found' })
    }
    return reply.send({ success: true, message: 'User deactivated' })
  })
}
