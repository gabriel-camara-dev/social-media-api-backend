import fastifyJwt from '@fastify/jwt'
import fastify, { FastifyPluginCallback } from 'fastify'
import { env } from './env'
import { ZodError } from 'zod'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import { appRoutes } from './http/routes'
import path from 'path'
import fastifyStatic from '@fastify/static'
import fastifyMultipart from '@fastify/multipart'
import { MulterError } from 'fastify-multer'

export const app = fastify()

app.register(cors, {
  origin: env.FRONTEND_URL,
  credentials: true,
})

app.register(fastifyMultipart)

app.register(fastifyCookie)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '5m',
  },
})

app.register(
  fastifyStatic as FastifyPluginCallback<{ root: string; prefix: string }>,
  {
    root: path.join(__dirname, '../uploads'),
    prefix: '/files/',
  }
)

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error!', issues: error.format() })
  } else if (error instanceof MulterError) {
    return reply.status(422).send({
      message: 'File error',
      issues: error.message + ' ' + error.field,
    })
  } else if (error.code === 'FST_ERR_CTP_EMPTY_JSON_BODY') {
    return reply.status(400).send({
      message:
        'Body cannot be empty when content-type is set to application/json',
    })
  } else if (error instanceof SyntaxError) {
    return reply.status(400).send({ message: error.message })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Send error to monitoring service
  }

  reply.status(500).send({ message: error.message })
})
