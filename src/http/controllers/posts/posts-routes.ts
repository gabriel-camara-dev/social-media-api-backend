import { FastifyInstance } from 'fastify'
import { createPost } from './create-post'
import { authentication } from '../../../middlewares/authentication'
import { updatePost } from './update-post'
import { deletePost } from './delete-post'
import { listPost } from './list-post'

export async function postsRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: authentication }, createPost)

  app.get('/:publicId', { preHandler: authentication }, listPost)

  app.patch('/:publicId', { preHandler: authentication }, updatePost)

  app.delete('/:publicId', { preHandler: authentication }, deletePost)
}
