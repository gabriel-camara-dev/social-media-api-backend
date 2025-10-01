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
  following: FollowerOrFollowing[]
}

export class ListFollowingUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    publicId,
  }: ListFollowingUseCaseRequest): Promise<ListFollowingUseCaseResponse> {
    const following = await this.usersRepository.listFollowing(publicId)

    if (following === null) {
      throw new ResourceNotFoundError()
    }

    return {
      following,
    }
  }
}
