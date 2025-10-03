import {
  CommentRepository,
  CommentWithAuthor,
} from '../../repositories/comments-repository'

interface CreateCommentUseCaseRequest {
  authorId: string
  postId: string
  content: string
  parentId?: string
  image?: string
}

interface CreateCommentUseCaseResponse {
  comment: CommentWithAuthor
}

export class CreateCommentUseCase {
  constructor(private readonly commentsRepository: CommentRepository) {}

  async execute({
    authorId,
    postId,
    content,
    parentId,
    image,
  }: CreateCommentUseCaseRequest): Promise<CreateCommentUseCaseResponse> {
    const comment = await this.commentsRepository.create({
      authorId,
      postId,
      content,
      parentId: parentId || null,
      image: image || null,
    })

    return {
      comment,
    }
  }
}
