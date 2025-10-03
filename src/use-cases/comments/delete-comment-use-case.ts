import { CommentRepository } from '../../repositories/comments-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UploadService } from '../../utils/upload'

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
    const comment = await this.commentsRepository.findByPublicId(commentPublicId)

    if (!comment) {
      throw new ResourceNotFoundError()
    }

    if (comment.authorId !== authorId) {
      throw new Error('Unauthorized')
    }

    if (comment.image) {
      await UploadService.deleteFile(comment.image)
    }

    await this.commentsRepository.delete(comment.id)

    return {
      success: true,
    }
  }
}