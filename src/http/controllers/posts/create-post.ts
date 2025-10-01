import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '../../../use-cases/errors/user-already-exists-error'
import { makeCreatePostUseCase } from '../../../use-cases/factories/make-create-posts-use-case'
import { PostPresenter } from '../../presenters/post-presenter'

export async function createPost(request: FastifyRequest, reply: FastifyReply) {
  const CreatePostBodySchema = z
    .object({
      content: z.string().min(1).max(500),
    })
    .parse(request.body)

  const { content } = CreatePostBodySchema

  const userId = request.userId

  if (!userId) {
    return await reply.status(401).send({ message: 'Unauthorized' })
  }

  try {
    const CreatePostUseCase = makeCreatePostUseCase()

    const { post } = await CreatePostUseCase.execute({
      userId,
      content,
    })

    return await reply.status(201).send({ post: PostPresenter.toHTTP(post) })
  } catch (err: unknown) {
    if (err instanceof UserAlreadyExistsError) {
      return await reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
