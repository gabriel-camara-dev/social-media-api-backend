import { CommentRepository } from '../../repositories/comments-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface DeleteCommentUseCaseRequest {
  commentPublicId: string
  authorId: string
}

interface DeleteCommentUseCaseResponse {
  success: boolean
}

export class DeleteCommentUseCase {
  constructor(private readonly commentsRepository: CommentRepository) {}

  async execute({
    commentPublicId,
    authorId,
  }: DeleteCommentUseCaseRequest): Promise<DeleteCommentUseCaseResponse> {
    const comment =
      await this.commentsRepository.findByPublicId(commentPublicId)

    if (!comment) {
      throw new ResourceNotFoundError()
    }

    if (comment.authorId !== authorId) {
      throw new Error('Unauthorized')
    }

    await this.commentsRepository.delete(comment.id)

    return {
      success: true,
    }
  }
}
