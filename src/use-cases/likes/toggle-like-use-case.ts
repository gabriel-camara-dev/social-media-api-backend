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
    if (postId) {
      const post = await this.postsRepository.findByPublicId(postId)
      if (!post) throw new PostNotFoundError()

      const wasLiked = await this.likesRepository.toggleLikePost(userId, postId)

      if (wasLiked && post.author.publicId !== userId) {
        await this.notificationService.create({
          type: 'LIKE',
          recipientId: post.author.publicId,
          actorId: userId,
          postId,
        })
      }
    } else if (commentId) {
      const comment = await this.commentsRepository.findByPublicId(commentId)
      if (!comment) throw new CommentNotFoundError()

      const wasLiked = await this.likesRepository.toggleLikeComment(
        userId,
        commentId
      )

      if (wasLiked && comment.author.publicId !== userId) {
        await this.notificationService.create({
          type: 'LIKE',
          recipientId: comment.author.publicId,
          actorId: userId,
          commentId,
        })
      }
    } else {
      throw new ResourceNotFoundError()
    }
  }
}
