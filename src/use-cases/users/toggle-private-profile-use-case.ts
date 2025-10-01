import { User } from '@prisma/client'
import {

  UsersRepository,
} from '../../repositories/users-repository'


interface TogglePrivateProfileUseCaseRequest {
  publicId: string
}

export class TogglePrivateProfileUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    publicId,
  }: TogglePrivateProfileUseCaseRequest): Promise<void> {
    await this.usersRepository.togglePrivateProfile(publicId)
  }
}
