import { FastifyInstance } from 'fastify'
import { register } from './register'
import { GetProfile } from './get-profile'
import { GetUserProfile } from './get-user-profile'
import { authentication } from '../../../middlewares/authentication'
import { followOrUnfollow } from './follow-or-unfollow'
import { listFollowing } from './list-following'
import { listFollowers } from './list-followers'
import { togglePrivateProfile } from './toggle-private-profile'
import { optionalAuthentication } from '../../../middlewares/optional-authentication'

export async function userRoutes(app: FastifyInstance) {
  app.post('', register)

  app.post(
    '/follow-or-unfollow/:publicId',
    { preHandler: authentication },
    followOrUnfollow
  )

  app.patch(
    '/toggle-private-profile',
    { preHandler: authentication },
    togglePrivateProfile
  )

  app.get('/profile/:publicId', { preHandler: optionalAuthentication }, GetUserProfile)
  app.get('/profile', { preHandler: authentication }, GetProfile)

  app.get('/followers', { preHandler: authentication }, listFollowers)
  app.get('/following', { preHandler: authentication }, listFollowing)
}
