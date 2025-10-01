import { User } from '@prisma/client'
import {
  FollowerOrFollowing,
  UsersRepository,
} from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface ListFollowersUseCaseRequest {
  publicId: string
}

interface ListFollowersUseCaseResponse {
  user: FollowerOrFollowing[]
}

export class ListFollowersUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    publicId,
  }: ListFollowersUseCaseRequest): Promise<ListFollowersUseCaseResponse> {
    const user = await this.usersRepository.listFollowers(publicId)

    if (user === null) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
