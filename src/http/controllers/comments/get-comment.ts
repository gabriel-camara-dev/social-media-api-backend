import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetCommentUseCase } from '../../../use-cases/factories/make-get-comment-use-case'
import { CommentPresenter } from '../../presenters/comment-presenter'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'

export async function getComment(request: FastifyRequest, reply: FastifyReply) {
  const getCommentParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = getCommentParamsSchema.parse(request.params)

  try {
    const getCommentUseCase = makeGetCommentUseCase()

    const { comment } = await getCommentUseCase.execute({
      publicId: id,
    })

    return reply.status(200).send({
      comment: CommentPresenter.toHTTP(comment),
    })
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: 'Comment not found' })
    }

    throw error
  }
}
