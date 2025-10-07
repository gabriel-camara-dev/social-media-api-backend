import { type FastifyRequest, type FastifyReply } from 'fastify'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'
import { makeGetUserProfileSummaryUseCase } from '../../../use-cases/factories/make-get-user-profile-summary-use-case'

export async function getMyProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.userId

  if (!userId) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  try {
    const getUserProfileSummaryUseCase = makeGetUserProfileSummaryUseCase()

    const { user } = await getUserProfileSummaryUseCase.execute({
      publicId: userId,
      viewerId: userId,
    })

    return reply.status(200).send({ user })
  } catch (err: unknown) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}