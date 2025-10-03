import { FastifyInstance } from 'fastify'
import { authentication } from '../../../middlewares/authentication'
import { createComment } from './create-comment'
import { getComment } from './get-comment'
import { updateComment } from './update-comment'
import { deleteComment } from './delete-comment'

export async function commentsRoutes(app: FastifyInstance) {
  app.post('/comments', { preHandler: authentication }, createComment)

  app.get('/comments/:id', { preHandler: authentication }, getComment)

  app.patch('/comments/:id', { preHandler: authentication }, updateComment)

  app.delete('/comments/:id', { preHandler: authentication }, deleteComment)
}
