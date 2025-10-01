import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { refreshToken } from './refresh-token'
import { logout } from './logout'
import { register } from './register'
import { GetProfile } from './get-profile'
import { GetUserProfile } from './get-user-profile'
import { authentication } from '../../../middlewares/authentication'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)

  app.post('/sessions', authenticate)

  app.post('/sessions/refresh-token', refreshToken)

  app.get('/profile/:publicId', GetUserProfile)
  app.get('/profile', { preHandler: authentication }, GetProfile)

  app.delete('/sessions', logout)
}
