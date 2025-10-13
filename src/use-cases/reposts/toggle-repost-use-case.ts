import { RepostRepository } from '../../repositories/reposts-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { NotificationService } from '../services/notification-service'

interface ToggleRepostUseCaseRequest {
  userId: string
  postId?: string
  commentId?: string
}

export class ToggleRepostUseCase {
  constructor(
    private readonly repostsRepository: RepostRepository,
    private readonly notificationService?: NotificationService
  ) {}

  async execute({
    userId,
    postId,
    commentId,
  }: ToggleRepostUseCaseRequest): Promise<void> {
    if (!postId && !commentId) {
      throw new ResourceNotFoundError()
    }

    const existingRepost = await this.repostsRepository.findByUserAndContent(
      userId,
      postId,
      commentId
    )

    if (existingRepost) {
      await this.repostsRepository.delete(existingRepost.id)
      return
    }

    if (postId) {
      await this.repostsRepository.create({ userId, postId })
    } else if (commentId) {
      await this.repostsRepository.create({ userId, commentId })
    }

    await this.notificationService?.create({
      type: 'REPOST',
      actorId: userId,
      postId,
      commentId,
    })
  }
}
