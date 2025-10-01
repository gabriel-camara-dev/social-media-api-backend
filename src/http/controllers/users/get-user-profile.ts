import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetUserProfileUseCase } from '../../../use-cases/factories/make-get-user-profile-use-case'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'

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

  try {
    const getUserProfileUseCase = makeGetUserProfileUseCase()

    const { user } = await getUserProfileUseCase.execute({
      publicId,
    })

    return await reply.status(201).send({ user })
  } catch (err: unknown) {
    if (err instanceof ResourceNotFoundError) {
      return await reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
