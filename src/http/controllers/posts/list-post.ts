import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '../../../use-cases/errors/user-already-exists-error'
import { PostPresenter } from '../../presenters/post-presenter'
import { makeListPostUseCase } from '../../../use-cases/factories/make-list-post-use-case'
import { PostNotFoundError } from '../../../use-cases/errors/post-not-found-error'

export async function listPost(request: FastifyRequest, reply: FastifyReply) {
  const listPostBodySchema = z
    .object({
      commentsLimit: z.number().min(1).max(100).default(10),
      repliesLimit: z.number().min(1).max(100).default(3),
    })
    .parse(request.query)

  const { commentsLimit, repliesLimit } = listPostBodySchema

  const listPostParamsSchema = z.object({
    publicId: z.string().uuid(),
  })

  const { publicId } = listPostParamsSchema.parse(request.params)

  try {
    const listPostUseCase = makeListPostUseCase()

    const { post } = await listPostUseCase.execute({
      publicId,
      options: { commentsLimit, repliesLimit },
    })

    return await reply
      .status(201)
      .send({ post: PostPresenter.toHTTPWithComments(post) })
  } catch (err: unknown) {
    if (err instanceof PostNotFoundError) {
      return await reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
