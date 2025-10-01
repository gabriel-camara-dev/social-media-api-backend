import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { ListFollowingUseCase } from '../users/list-following-use-case'

export function makeListFollowingUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const istFollowingUseCase = new ListFollowingUseCase(usersRepository)

  return istFollowingUseCase
}