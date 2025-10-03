import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { DeleteProfileUseCase } from '../users/delete-profile-use-case'

export function makeDeleteProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const deleteProfileUseCase = new DeleteProfileUseCase(usersRepository)

  return deleteProfileUseCase
}
