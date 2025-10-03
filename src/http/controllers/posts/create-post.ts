import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreatePostUseCase } from '../../../use-cases/factories/make-create-posts-use-case'
import { PostPresenter } from '../../presenters/post-presenter'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'

export async function createPost(request: FastifyRequest, reply: FastifyReply) {
  const createPostBodySchema = z.object({
    content: z.string().min(1).max(500),
  })

  const { content } = createPostBodySchema.parse(request.body)

  const file = (request as any).file
  const image = file?.filename

  const userId = request.userId

  if (!userId) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  try {
    const createPostUseCase = makeCreatePostUseCase()

    const { post } = await createPostUseCase.execute({
      userId,
      content,
      image,
    })

    return reply.status(201).send({ post: PostPresenter.toHTTP(post) })
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
