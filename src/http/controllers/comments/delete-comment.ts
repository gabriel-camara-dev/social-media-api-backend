// src/http/controllers/comments/delete-comment.ts
import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteCommentUseCase } from '../../../use-cases/factories/make-delete-comment-use-case'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'

export async function deleteComment(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const deleteCommentParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = deleteCommentParamsSchema.parse(request.params)

  const authorId = request.userId

  if (!authorId) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  try {
    const deleteCommentUseCase = makeDeleteCommentUseCase()

    await deleteCommentUseCase.execute({
      commentPublicId: id,
      authorId,
    })

    return reply.status(200).send({
      message: 'Comment deleted successfully',
    })
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error.message === 'Unauthorized') {
      return reply
        .status(403)
        .send({ message: 'Unauthorized to delete this comment' })
    }

    throw error
  }
}
