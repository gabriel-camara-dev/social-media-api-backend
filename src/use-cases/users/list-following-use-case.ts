import { User } from '@prisma/client'
import {
  FollowerOrFollowing,
  UsersRepository,
} from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface ListFollowingUseCaseRequest {
  publicId: string
}

interface ListFollowingUseCaseResponse {
  user: FollowerOrFollowing[]
}

export class ListFollowersUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    publicId,
  }: ListFollowingUseCaseRequest): Promise<ListFollowingUseCaseResponse> {
    const user = await this.usersRepository.listFollowing(publicId)

    if (user === null) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
