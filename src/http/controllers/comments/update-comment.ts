// src/http/controllers/comments/update-comment.ts
import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateCommentUseCase } from '../../../use-cases/factories/make-update-comment-use-case'
import { CommentPresenter } from '../../presenters/comment-presenter'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'

export async function updateComment(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const updateCommentParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const updateCommentBodySchema = z.object({
    content: z.string().min(1).max(500),
  })

  const { id } = updateCommentParamsSchema.parse(request.params)
  const { content } = updateCommentBodySchema.parse(request.body)

  const authorId = request.userId

  if (!authorId) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  try {
    const updateCommentUseCase = makeUpdateCommentUseCase()

    const { comment: updatedComment } = await updateCommentUseCase.execute({
      commentPublicId: id,
      authorId,
      content,
    })

    return reply.status(200).send({
      comment: CommentPresenter.toHTTP(updatedComment),
    })
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error.message === 'Unauthorized') {
      return reply
        .status(403)
        .send({ message: 'Unauthorized to update this comment' })
    }

    throw error
  }
}
