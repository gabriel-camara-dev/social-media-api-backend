import {
  UserProfileInfo,
  UsersRepository,
} from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface FollowOrUnfollowUseCaseRequest {
  followerId: string
  followingId: string
}

export class FollowOrUnfollowUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    followerId,
    followingId,
  }: FollowOrUnfollowUseCaseRequest): Promise<void> {
    const following = await this.usersRepository.findByPublicId(followingId)
    const follower = await this.usersRepository.findByPublicId(followerId)

    if (following === null || follower === null) {
      throw new ResourceNotFoundError()
    }

    await this.usersRepository.followOrUnfollowUser(followerId, followingId)
  }
}
