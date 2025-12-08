import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { GetUserProfileSummaryUseCase } from '../users/get-user-profile-summary-use-case'


export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const getUserProfileUseCase = new GetUserProfileSummaryUseCase(usersRepository)

  return getUserProfileUseCase
}