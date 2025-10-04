import type { User } from '@prisma/client'
import { UsersRepository } from '../../repositories/users-repository'
import { UserWithSameEmailError } from '../errors/user-with-same-email-error'
import { UsernameAlreadyTakenError } from '../errors/username-already-taken'

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
    const userWithSameUsername = await this.usersRepository.findByUsername(
      data.username || ''
    )

    if (userWithSameUsername) {
      throw new UsernameAlreadyTakenError()
    }

    const updatedUser = await this.usersRepository.update(userId, data)

    return {
      user: updatedUser,
    }
  }
}
