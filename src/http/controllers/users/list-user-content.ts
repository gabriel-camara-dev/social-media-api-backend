import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetUserContentUseCase } from '../../../use-cases/factories/make-get-user-content-use-case'
import { UserProfileIsPrivateError } from '../../../use-cases/errors/user-profile-is-private-error'
import { PostPresenter } from '../../presenters/post-presenter'
import { RepostPresenter } from '../../presenters/repost-presenter'
import { PostsWithAuthor } from '../../../repositories/posts-repository'
import { RepostWithDetails } from '../../presenters/repost-presenter'

export async function listUserContent(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const listUserContentParamsSchema = z.object({
    publicId: z.string().uuid(),
  })
  const listUserContentQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(20),
  })

  const { publicId } = listUserContentParamsSchema.parse(request.params)
  const { page, limit } = listUserContentQuerySchema.parse(request.query)
  const viewerId = request.userId

  try {
    const getUserContentUseCase = makeGetUserContentUseCase()

    const { content } = await getUserContentUseCase.execute({
      publicId,
      viewerId,
      page,
      limit,
    })

    const httpContent = content.map((item) => {
      if ('author' in item && 'content' in item) {
        return { type: 'post', ...PostPresenter.toHTTP(item as PostsWithAuthor) }
      }
      if ('user' in item) {
        return { type: 'repost', ...RepostPresenter.toHTTP(item as RepostWithDetails) }
      }
      return null
    }).filter(Boolean)

    return reply.status(200).send({ content: httpContent })
  } catch (err: unknown) {
    if (err instanceof UserProfileIsPrivateError) {
      return reply.status(403).send({ message: err.message })
    }
    throw err
  }
}