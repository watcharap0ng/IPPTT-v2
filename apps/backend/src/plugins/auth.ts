import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fp from 'fastify-plugin'
import { config } from '../config/index.js'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    authorize: (roles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string; email: string; role: string }
    user: { id: string; email: string; role: string }
  }
}

async function authPlugin(app: FastifyInstance) {
  await app.register(fastifyJwt, {
    secret: config.jwt.secret,
  })

  app.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.code(401).send({ success: false, error: 'Unauthorized' })
    }
  })

  app.decorate('authorize', function (roles: string[]) {
    return async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify()
        if (!roles.includes(request.user.role)) {
          reply.code(403).send({ success: false, error: 'Forbidden' })
        }
      } catch (err) {
        reply.code(401).send({ success: false, error: 'Unauthorized' })
      }
    }
  })
}

export default fp(authPlugin)
