import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'
import { UserProfileIsPrivateError } from '../../../use-cases/errors/user-profile-is-private-error'
import { makeGetUserProfileSummaryUseCase } from '../../../use-cases/factories/make-get-user-profile-summary-use-case'

export async function GetUserProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const GetUsersProfileParamsSchema = z
    .object({
      publicId: z.string().uuid(),
    })
    .parse(request.params)

  const { publicId } = GetUsersProfileParamsSchema
  const viewerId = request.userId

  try {
    const getUserProfileSummaryUseCase = makeGetUserProfileSummaryUseCase()

    const { user } = await getUserProfileSummaryUseCase.execute({
      publicId,
      viewerId,
    })

    return reply.status(200).send({ user })
  } catch (err: unknown) {
    if (err instanceof UserProfileIsPrivateError) {
      return reply.status(403).send({ message: err.message })
    } else if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
