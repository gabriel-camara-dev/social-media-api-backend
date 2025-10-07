import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { GetUserContentUseCase } from '../users/get-user-content-use-case'

export function makeGetUserContentUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserContentUseCase(usersRepository)
  return useCase
}