import { verify } from 'jsonwebtoken'
import { PrismaUsersRepository } from '../repositories/prisma/prisma-users-repository'
import { env } from '../env'
import { FastifyReply, FastifyRequest } from 'fastify'

interface IPayload {
  sub: string
}

export async function optionalAuthentication(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const headerAuthorization = request.headers.authorization

  if (!headerAuthorization) {
    request.userId = undefined
    return
  }

  try {
    const [, token] = headerAuthorization.split(' ')
    const { sub: user_id } = verify(token, env.JWT_SECRET) as IPayload

    const usersRepository = new PrismaUsersRepository()
    const user = await usersRepository.findByPublicId(user_id)

    if (!user) {
      request.userId = undefined
      return
    }

    request.userId = user_id
  } catch {
    request.userId = undefined
  }
}
