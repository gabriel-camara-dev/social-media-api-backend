import { UsersRepository } from '../../repositories/users-repository'
import { CantFollowYourselfError } from '../errors/cant-follow-yourself-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { NotificationService } from '../services/notification-service'

interface FollowOrUnfollowUseCaseRequest {
  followerId: string
  followingId: string
}

export class FollowOrUnfollowUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly notificationService: NotificationService
  ) {}

  async execute({
    followerId,
    followingId,
  }: FollowOrUnfollowUseCaseRequest): Promise<void> {
    if (followerId === followingId) {
      throw new CantFollowYourselfError()
    }

    const following = await this.usersRepository.findByPublicId(followingId)
    const follower = await this.usersRepository.findByPublicId(followerId)

    if (following === null || follower === null) {
      throw new ResourceNotFoundError()
    }

    const isFollowing = await this.usersRepository.followOrUnfollowUser(
      followerId,
      followingId
    )

    if (isFollowing) {
      await this.notificationService.createFollowNotification(
        followingId,
        followerId
      )
    }
  }
}
