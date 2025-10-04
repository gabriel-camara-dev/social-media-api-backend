import { type FastifyRequest, type FastifyReply } from 'fastify'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'
import { z } from 'zod'
import { makeFollowOrUnfollowUseCase } from '../../../use-cases/factories/make-follow-or-unfollow-use-case'
import { CantFollowYourselfError } from '../../../use-cases/errors/cant-follow-yourself-error'

export async function followOrUnfollow(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const FollowOrUnfollowParamsSchema = z
    .object({
      publicId: z.string().uuid(),
    })
    .parse(request.params)

  const { publicId } = FollowOrUnfollowParamsSchema

  const userId = request.userId

  if (!userId) {
    return await reply.status(401).send({ message: 'Unauthorized' })
  }

  try {
    const followOrUnfollowUseCase = makeFollowOrUnfollowUseCase()

    await followOrUnfollowUseCase.execute({
      followerId: userId,
      followingId: publicId,
    })

    return await reply.status(200).send()
  } catch (err: unknown) {
    if (err instanceof ResourceNotFoundError) {
      return await reply.status(404).send({ message: err.message })
    }

    if (err instanceof CantFollowYourselfError) {
      return await reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
