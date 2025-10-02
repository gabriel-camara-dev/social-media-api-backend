import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeRegisterUseCase } from '../../../use-cases/factories/make-register-use-case'
import { UserAlreadyExistsError } from '../../../use-cases/errors/user-already-exists-error'
import { UserPresenter } from '../../presenters/user-presenter'
import { makeUpdateUserUseCase } from '../../../use-cases/factories/make-update-user-use-case'
import { UsernameAlreadyTakenError } from '../../../use-cases/errors/username-already-taken'

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const updateUserBodySchema = z
    .object({
      name: z.string().optional(),
      username: z
        .string()
        .min(3, 'Username must be at least 3 characters long')
        .max(25, 'Username must be at most 25 characters long')
        .regex(
          /^[a-zA-Z0-9_]+$/,
          'Username can only contain letters, numbers, and underscores (_)'
        )
        .optional(),
      description: z.string().nullable().optional(),
      birthDate: z.coerce.date().nullable().optional(),
    })
    .parse(request.body)

  const { name, username, description, birthDate } = updateUserBodySchema

  const userId = request.userId

  if (!userId) {
    return await reply.status(401).send({ message: 'Unauthorized' })
  }

  try {
    const updateUserUserCase = makeUpdateUserUseCase()

    const { user } = await updateUserUserCase.execute({
      userId,
      data: { name, username, description, birthDate },
    })

    return await reply.status(201).send({ user: UserPresenter.toHTTP(user) })
  } catch (err: unknown) {
    if (err instanceof UsernameAlreadyTakenError) {
      return await reply.status(409).send({ message: err.message })
    }

    throw err
  }
}
