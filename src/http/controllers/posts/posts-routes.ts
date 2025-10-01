import { FastifyInstance } from 'fastify'
import { createPost } from './create-post'
import { authentication } from '../../../middlewares/authentication'

export async function postsRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: authentication }, createPost)
}
