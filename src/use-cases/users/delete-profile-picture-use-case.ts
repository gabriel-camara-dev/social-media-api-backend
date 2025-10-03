import { UsersRepository } from '../../repositories/users-repository'
import { UploadService } from '../../utils/upload'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface DeleteProfilePictureUseCaseRequest {
  publicId: string
}

interface DeleteProfilePictureUseCaseResponse {
  success: boolean
}

export class DeleteProfilePictureUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    publicId,
  }: DeleteProfilePictureUseCaseRequest): Promise<DeleteProfilePictureUseCaseResponse> {
    const user = await this.usersRepository.findByPublicId(publicId)

    if (!user || !user.profilePicture) {
      throw new ResourceNotFoundError()
    }

    const deleteResult = await UploadService.deleteFile(user.profilePicture)

    if (!deleteResult.success) {
      throw new Error('Error deleting profile picture file')
    }

    await this.usersRepository.update(publicId, {
      profilePicture: null,
    })

    return {
      success: true,
    }
  }
}
