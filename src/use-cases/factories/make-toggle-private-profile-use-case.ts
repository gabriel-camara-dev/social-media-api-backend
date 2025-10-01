import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { TogglePrivateProfileUseCase } from '../users/toggle-private-profile-use-case'

export function makeTogglePrivateProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const togglePrivateProfileUseCase = new TogglePrivateProfileUseCase(
    usersRepository
  )

  return togglePrivateProfileUseCase
}
