import { UsersRepository } from '../../repositories/users-repository'
import { UploadService } from '../../utils/upload'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface UploadProfilePictureUseCaseRequest {
  publicId: string
  filename: string
}

interface UploadProfilePictureUseCaseResponse {
  success: boolean
  profilePicture?: string
}

export class UploadProfilePictureUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    publicId,
    filename,
  }: UploadProfilePictureUseCaseRequest): Promise<UploadProfilePictureUseCaseResponse> {
    const user = await this.usersRepository.findByPublicId(publicId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (user.profilePicture) {
      await UploadService.deleteFile(user.profilePicture)
    }

    const updatedUser = await this.usersRepository.update(publicId, {
      profilePicture: filename,
    })

    return {
      success: true,
      profilePicture: updatedUser.profilePicture || undefined,
    }
  }
}
