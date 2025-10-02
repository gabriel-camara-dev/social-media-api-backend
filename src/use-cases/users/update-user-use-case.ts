import type { User } from '@prisma/client'
import { UsersRepository } from '../../repositories/users-repository'

interface UpdateUserUseCaseRequest {
  userId: string
  data: {
    name?: string
    username?: string
    description?: string | null
    birthDate?: Date | null
  }
}

interface UpdateUserUseCaseResponse {
  user: User
}

export class UpdateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    userId,
    data,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const updatedUser = await this.usersRepository.update(userId, data)

    return {
      user: updatedUser,
    }
  }
}
