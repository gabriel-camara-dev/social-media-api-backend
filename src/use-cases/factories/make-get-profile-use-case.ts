import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { GetProfileUseCase } from '../users/get-profile-use-case'

export function makeGetProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const getProfileUseCase = new GetProfileUseCase(usersRepository)

  return getProfileUseCase
}