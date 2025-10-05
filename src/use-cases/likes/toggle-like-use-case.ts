import { CommentRepository } from '../../repositories/comments-repository'
import { LikeRepository } from '../../repositories/like-repository'
import {
  PostsRepository,
  PostsWithAuthor,
} from '../../repositories/posts-repository'
import { UsersRepository } from '../../repositories/users-repository'
import { CommentNotFoundError } from '../errors/comment-not-found-error'
import { PostNotFoundError } from '../errors/post-not-found-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface ToggleLikeUseCaseRequest {
  userId: string
  postId?: string
  commentId?: string
}

export class ToggleLikeUseCase {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly likesRepository: LikeRepository,
    private readonly commentsRepository: CommentRepository
  ) {}

  async execute({ userId, postId, commentId }: ToggleLikeUseCaseRequest) {
    if (postId) {
      const post = await this.postsRepository.findByPublicId(postId)

      if (!post) {
        throw new PostNotFoundError()
      }

      await this.likesRepository.toggleLikePost(userId, postId)
    } else if (commentId) {
      const comment = await this.commentsRepository.findByPublicId(commentId)

      if (!comment) {
        throw new CommentNotFoundError()
      }

      await this.likesRepository.toggleLikeComment(userId, commentId)
    } else {
      throw new ResourceNotFoundError()
    }
  }
}
