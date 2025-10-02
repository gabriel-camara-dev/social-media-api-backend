import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '../../../use-cases/errors/user-already-exists-error'
import { makeCreatePostUseCase } from '../../../use-cases/factories/make-create-posts-use-case'
import { PostPresenter } from '../../presenters/post-presenter'
import { makeUpdatePostUseCase } from '../../../use-cases/factories/make-update-post-use-case'
import { PostNotFoundError } from '../../../use-cases/errors/post-not-found-error'

export async function updatePost(request: FastifyRequest, reply: FastifyReply) {
  const updatePostParamsSchema = z.object({
    publicId: z.string().uuid(),
  })

  const { publicId } = updatePostParamsSchema.parse(request.params)

  const updatePostBodySchema = z
    .object({
      content: z.string().min(1).max(500).optional(),
    })
    .parse(request.body)

  const { content } = updatePostBodySchema

  try {
    const updatePostUseCase = makeUpdatePostUseCase()

    const { post } = await updatePostUseCase.execute({
      publicId,
      data: { content },
    })

    return await reply.status(201).send({ post: PostPresenter.toHTTP(post) })
  } catch (err: unknown) {
    if (err instanceof PostNotFoundError) {
      return await reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
