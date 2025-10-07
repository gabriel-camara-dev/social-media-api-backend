import { FastifyInstance } from 'fastify'
import { createPost } from './create-post'
import { authentication } from '../../../middlewares/authentication'
import { updatePost } from './update-post'
import { deletePost } from './delete-post'
import { listPost } from './list-post'
import { upload } from '../../../lib/multer'
import { getFeed } from './get-feed'
import { optionalAuthentication } from '../../../middlewares/optional-authentication'

export async function postsRoutes(app: FastifyInstance) {
  app.get('/feed', { preHandler: optionalAuthentication }, getFeed)

  app.post(
    '/',
    {
      preHandler: [authentication, upload.single('image')],
    },
    createPost
  )

  app.get('/:publicId', { preHandler: authentication }, listPost)

  app.patch('/:publicId', { preHandler: authentication }, updatePost)

  app.delete('/:publicId', { preHandler: authentication }, deletePost)
}
