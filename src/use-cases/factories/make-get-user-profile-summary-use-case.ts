import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { GetUserProfileSummaryUseCase } from '../users/get-user-profile-summary-use-case'

export function makeGetUserProfileSummaryUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserProfileSummaryUseCase(usersRepository)
  return useCase
}
