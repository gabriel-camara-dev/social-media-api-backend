import { CommentRepository } from '../../repositories/comments-repository'
import { LikeRepository } from '../../repositories/like-repository'
import { PostsRepository } from '../../repositories/posts-repository'
import { CommentNotFoundError } from '../errors/comment-not-found-error'
import { PostNotFoundError } from '../errors/post-not-found-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { NotificationService } from '../services/notification-service'

interface ToggleLikeUseCaseRequest {
  userId: string
  postId?: string
  commentId?: string
}

export class ToggleLikeUseCase {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly likesRepository: LikeRepository,
    private readonly commentsRepository: CommentRepository,
    private readonly notificationService: NotificationService
  ) {}

  async execute({ userId, postId, commentId }: ToggleLikeUseCaseRequest) {
    let wasLiked = false

    if (postId) {
      const post = await this.postsRepository.findByPublicId(postId)
      if (!post) throw new PostNotFoundError()
      wasLiked = await this.likesRepository.toggleLikePost(userId, postId)
    } else if (commentId) {
      const comment = await this.commentsRepository.findByPublicId(commentId)
      if (!comment) throw new CommentNotFoundError()
      wasLiked = await this.likesRepository.toggleLikeComment(userId, commentId)
    } else {
      throw new ResourceNotFoundError()
    }

    if (wasLiked) {
      await this.notificationService.create({
        type: 'LIKE',
        actorId: userId,
        postId,
        commentId,
      })
    }
  }
}
