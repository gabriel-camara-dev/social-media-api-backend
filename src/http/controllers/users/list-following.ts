import { type FastifyRequest, type FastifyReply } from 'fastify'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'
import { makeListFollowingUseCase } from '../../../use-cases/factories/make-list-following-use-case'

export async function listFollowing(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.userId

  if (!userId) {
    return await reply.status(401).send({ message: 'Unauthorized' })
  }

  try {
    const listFollowingUseCase = makeListFollowingUseCase()

    const { following } = await listFollowingUseCase.execute({
      publicId: userId,
    })

    return await reply.status(201).send({ following })
  } catch (err: unknown) {
    if (err instanceof ResourceNotFoundError) {
      return await reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
