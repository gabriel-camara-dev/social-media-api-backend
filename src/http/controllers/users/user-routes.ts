import { FastifyInstance } from 'fastify'
import { register } from './register'
import { GetProfile } from './get-profile'
import { GetUserProfile } from './get-user-profile'
import { authentication } from '../../../middlewares/authentication'
import { followOrUnfollow } from './follow-or-unfollow'

export async function userRoutes(app: FastifyInstance) {
  app.post('', register)
  
  app.post(
    '/follow-or-unfollow/:publicId',
    { preHandler: authentication },
    followOrUnfollow
  )

  app.get('/profile/:publicId', GetUserProfile)
  app.get('/profile', { preHandler: authentication }, GetProfile)
}
