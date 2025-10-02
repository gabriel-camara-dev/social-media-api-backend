import { UsersRepository } from '../../repositories/users-repository'

interface DeleteProfileUseCaseRequest {
  userId: string
}

export class DeleteProfileUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ userId }: DeleteProfileUseCaseRequest) {
    const updatedUser = await this.usersRepository.delete(userId)

    return {
      user: updatedUser,
    }
  }
}
