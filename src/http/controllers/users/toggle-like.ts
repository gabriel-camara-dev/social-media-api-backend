import { type FastifyRequest, type FastifyReply } from 'fastify'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'
import { makeToggleLikeUseCase } from '../../../use-cases/factories/make-toggle-like-use-case'
import { z } from 'zod'
import { PostNotFoundError } from '../../../use-cases/errors/post-not-found-error'
import { CommentNotFoundError } from '../../../use-cases/errors/comment-not-found-error'

export async function toggleLikePost(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.userId

  if (!userId) {
    return await reply.status(401).send({ message: 'Unauthorized' })
  }

  const toggleLikeParamsSchema = z
    .object({
      postId: z.string().optional(),
    })
    .parse(request.params)

  const { postId } = toggleLikeParamsSchema

  try {
    const toggleLikeUseCase = makeToggleLikeUseCase()

    await toggleLikeUseCase.execute({
      userId,
      postId,
    })

    return await reply.status(200).send()
  } catch (err: unknown) {
    if (
      err instanceof ResourceNotFoundError ||
      err instanceof PostNotFoundError
    ) {
      return await reply.status(404).send({ message: err.message })
    }

    throw err
  }
}

export async function toggleLikeComment(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.userId

  if (!userId) {
    return await reply.status(401).send({ message: 'Unauthorized' })
  }

  const toggleLikeParamsSchema = z
    .object({
      commentId: z.string().optional(),
    })
    .parse(request.params)

  const { commentId } = toggleLikeParamsSchema

  try {
    const toggleLikeUseCase = makeToggleLikeUseCase()

    await toggleLikeUseCase.execute({
      userId,
      commentId,
    })

    return await reply.status(200).send()
  } catch (err: unknown) {
    if (
      err instanceof ResourceNotFoundError ||
      err instanceof CommentNotFoundError
    ) {
      return await reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
