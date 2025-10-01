import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { ListFollowersUseCase } from '../users/list-followers-use-case'

export function makeListFollowerUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const istFollowerUseCase = new ListFollowersUseCase(usersRepository)

  return istFollowerUseCase
}