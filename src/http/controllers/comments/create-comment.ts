// src/http/controllers/comments/create-comment.ts
import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateCommentUseCase } from '../../../use-cases/factories/make-create-comment-use-case'
import { CommentPresenter } from '../../presenters/comment-presenter'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'

export async function createComment(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const createCommentBodySchema = z.object({
    content: z.string().min(1).max(500),
    postId: z.string().uuid(),
    parentId: z.string().uuid().optional(),
  })

  const { content, postId, parentId } = createCommentBodySchema.parse(
    request.body
  )

  const authorId = request.userId

  if (!authorId) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  try {
    const createCommentUseCase = makeCreateCommentUseCase()

    const { comment } = await createCommentUseCase.execute({
      authorId,
      postId,
      content,
      parentId,
    })

    return reply.status(201).send({
      comment: CommentPresenter.toHTTP(comment),
    })
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    return reply.status(500).send({
      message: error.message || 'Error creating comment',
    })
  }
}
