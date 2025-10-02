import { type FastifyRequest, type FastifyReply } from 'fastify'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'
import { makeDeleteProfileUseCase } from '../../../use-cases/factories/make-delete-profile-use-case'

export async function deleteProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.userId

  if (!userId) {
    return await reply.status(401).send({ message: 'Unauthorized' })
  }

  try {
    const deleteProfileUseCase = makeDeleteProfileUseCase()

    await deleteProfileUseCase.execute({ userId })

    return await reply.status(200).send()
  } catch (err: unknown) {
    if (err instanceof ResourceNotFoundError) {
      return await reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
