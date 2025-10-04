import { UsersRepository } from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface TogglePrivateProfileUseCaseRequest {
  publicId: string
}

export class TogglePrivateProfileUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    publicId,
  }: TogglePrivateProfileUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findByPublicId(publicId)

    if (!user) {
      throw new ResourceNotFoundError
    }

    await this.usersRepository.togglePrivateProfile(publicId)
  }
}
