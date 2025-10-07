import { RepostRepository } from '../../repositories/reposts-repository'
import { CommentNotFoundError } from '../errors/comment-not-found-error'
import { PostNotFoundError } from '../errors/post-not-found-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface ToggleRepostUseCaseRequest {
  userId: string
  postId?: string
  commentId?: string
}

export class ToggleRepostUseCase {
  constructor(private readonly repostsRepository: RepostRepository) {}

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
    } else {
      if (postId) {
        await this.repostsRepository.create({
          userId,
          postId,
        })
      } else if (commentId) {
        await this.repostsRepository.create({
          userId,
          commentId,
        })
      }
    }
  }
}