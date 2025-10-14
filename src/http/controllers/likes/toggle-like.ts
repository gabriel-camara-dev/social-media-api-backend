import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'
import { makeToggleLikeUseCase } from '../../../use-cases/factories/make-toggle-like-use-case'
import { CommentNotFoundError } from '../../../use-cases/errors/comment-not-found-error'
import { PostNotFoundError } from '../../../use-cases/errors/post-not-found-error'

export async function toggleLike(request: FastifyRequest, reply: FastifyReply) {
  const toggleLikeBodySchema = z.object({
    postId: z.string().uuid().optional(),
    commentId: z.string().uuid().optional(),
  })

  const { postId, commentId } = toggleLikeBodySchema.parse(request.body)

  const userId = request.userId
  if (!userId) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  try {
    const toggleLikeUseCase = makeToggleLikeUseCase()

    await toggleLikeUseCase.execute({
      userId,
      postId,
      commentId,
    })

    return reply.status(200).send()
  } catch (error: any) {
    if (
      error instanceof ResourceNotFoundError ||
      error instanceof CommentNotFoundError ||
      error instanceof PostNotFoundError
    ) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
