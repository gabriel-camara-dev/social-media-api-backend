import {
  CommentRepository,
  CommentWithAuthor,
} from '../../repositories/comments-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetCommentUseCaseRequest {
  publicId: string
}

interface GetCommentUseCaseResponse {
  comment: CommentWithAuthor
}

export class GetCommentUseCase {
  constructor(private readonly commentsRepository: CommentRepository) {}

  async execute({
    publicId,
  }: GetCommentUseCaseRequest): Promise<GetCommentUseCaseResponse> {
    const comment = await this.commentsRepository.findByPublicId(publicId)

    if (!comment) {
      throw new ResourceNotFoundError()
    }

    return {
      comment,
    }
  }
}
