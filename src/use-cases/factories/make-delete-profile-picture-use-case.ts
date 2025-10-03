import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { DeleteProfilePictureUseCase } from '../users/delete-profile-picture-use-case'

export function makeDeleteProfilePictureUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const deleteProfilePictureUseCase = new DeleteProfilePictureUseCase(
    usersRepository
  )

  return deleteProfilePictureUseCase
}
