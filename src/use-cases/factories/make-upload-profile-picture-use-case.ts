import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { UploadProfilePictureUseCase } from '../users/upload-profile-picture-use-case'

export function makeUploadProfilePictureUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const uploadProfilePictureUseCase = new UploadProfilePictureUseCase(
    usersRepository
  )

  return uploadProfilePictureUseCase
}
