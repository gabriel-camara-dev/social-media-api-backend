import { FastifyInstance } from 'fastify'
import { userRoutes } from './controllers/users/user-routes'
import { postsRoutes } from './controllers/posts/posts-routes'
import { authenticate } from './controllers/users/authenticate'
import { refreshToken } from './controllers/users/refresh-token'
import { logout } from './controllers/users/logout'
import { commentsRoutes } from './controllers/comments/comments-routes'
import { repostsRoutes } from './reposts/repost-routes'

export async function appRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate)
  app.post('/sessions/refresh-token', refreshToken)
  app.delete('/sessions', logout)

  app.register(userRoutes, { prefix: '/users' })
  app.register(postsRoutes, { prefix: '/posts' })
  app.register(commentsRoutes, { prefix: '/comments' })
  app.register(repostsRoutes, { prefix: '/reposts' })
}
