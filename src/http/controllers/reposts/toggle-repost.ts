import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'
import { makeToggleRepostUseCase } from '../../../use-cases/factories/make-toggle-repost-use-case'

export async function toggleRepost(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const toggleRepostBodySchema = z.object({
    postId: z.string().uuid().optional(),
    commentId: z.string().uuid().optional(),
  })

  const { postId, commentId } = toggleRepostBodySchema.parse(request.body)

  const userId = request.userId
  if (!userId) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  try {
    const toggleRepostUseCase = makeToggleRepostUseCase()

    await toggleRepostUseCase.execute({
      userId,
      postId,
      commentId,
    })

    return reply.status(200).send()
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
