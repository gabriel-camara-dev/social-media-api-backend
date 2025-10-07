import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFollowOrUnfollowUseCase } from '../../../use-cases/factories/make-follow-or-unfollow-use-case'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'
import { CantFollowYourselfError } from '../../../use-cases/errors/cant-follow-yourself-error'

export async function followOrUnfollow(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const followOrUnfollowParamsSchema = z.object({
    publicId: z.string().uuid(),
  })

  const { publicId: followingId } = followOrUnfollowParamsSchema.parse(
    request.params
  )

  const followerId = request.userId

  if (!followerId) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  try {
    const followOrUnfollowUseCase = makeFollowOrUnfollowUseCase()

    await followOrUnfollowUseCase.execute({
      followerId,
      followingId,
    })

    return reply.status(204).send()
  } catch (error: any) {
    if (
      error instanceof ResourceNotFoundError ||
      error instanceof CantFollowYourselfError
    ) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
