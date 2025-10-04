import { type FastifyRequest, type FastifyReply } from 'fastify'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'
import { makeListFollowerUseCase } from '../../../use-cases/factories/make-list-follower-use-case'
import { makeTogglePrivateProfileUseCase } from '../../../use-cases/factories/make-toggle-private-profile-use-case'

export async function togglePrivateProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.userId

  if (!userId) {
    return await reply.status(401).send({ message: 'Unauthorized' })
  }

  try {
    const togglePrivateProfileUseCase = makeTogglePrivateProfileUseCase()

    await togglePrivateProfileUseCase.execute({
      publicId: userId,
    })

    return await reply.status(200).send()
  } catch (err: unknown) {
    if (err instanceof ResourceNotFoundError) {
      return await reply.status(404).send({ message: err.message })
    }
    throw err
  }
}
