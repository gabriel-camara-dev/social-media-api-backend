import { FastifyInstance } from 'fastify'
import { register } from './register'
import { GetProfile } from './get-profile'
import { GetUserProfile } from './get-user-profile'
import { authentication } from '../../../middlewares/authentication'

export async function userRoutes(app: FastifyInstance) {
  app.post('', register)

  app.get('/profile/:publicId', GetUserProfile)
  app.get('/profile', { preHandler: authentication }, GetProfile)
}
