import { type FastifyRequest, type FastifyReply } from 'fastify'
import { makeGetProfileUseCase } from '../../../use-cases/factories/make-get-profile-use-case'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'

export async function GetProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.userId

  if (!userId) {
    return await reply.status(401).send({ message: 'Unauthorized' })
  }

  try {
    const getProfileUseCase = makeGetProfileUseCase()

    const { user } = await getProfileUseCase.execute({
      userId,
    })

    return await reply.status(201).send({ user })
  } catch (err: unknown) {
    if (err instanceof ResourceNotFoundError) {
      return await reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
