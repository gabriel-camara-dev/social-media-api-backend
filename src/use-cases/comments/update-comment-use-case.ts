import {
  CommentRepository,
  CommentWithAuthor,
} from '../../repositories/comments-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface UpdateCommentUseCaseRequest {
  commentPublicId: string
  authorId: string
  content: string
}

interface UpdateCommentUseCaseResponse {
  comment: CommentWithAuthor
}

export class UpdateCommentUseCase {
  constructor(private readonly commentsRepository: CommentRepository) {}

  async execute({
    commentPublicId,
    authorId,
    content,
  }: UpdateCommentUseCaseRequest): Promise<UpdateCommentUseCaseResponse> {
    const comment =
      await this.commentsRepository.findByPublicId(commentPublicId)

    if (!comment) {
      throw new ResourceNotFoundError()
    }

    if (comment.authorId !== authorId) {
      throw new Error('Unauthorized')
    }

    const updatedComment = await this.commentsRepository.update(comment.id, {
      content,
    })

    return {
      comment: updatedComment,
    }
  }
}
