import {
  CommentRepository,
  CommentWithAuthor,
} from '../../repositories/comments-repository'
import { PostsRepository } from '../../repositories/posts-repository'
import { UsersRepository } from '../../repositories/users-repository'
import { PostNotFoundError } from '../errors/post-not-found-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

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
  constructor(
    private readonly commentsRepository: CommentRepository,
    private readonly usersRepository: UsersRepository,
    private readonly postsRepository: PostsRepository
  ) {}

  async execute({
    authorId,
    postId,
    content,
    parentId,
    image,
  }: CreateCommentUseCaseRequest): Promise<CreateCommentUseCaseResponse> {
    const user = await this.usersRepository.findByPublicId(authorId)
    if (!user) throw new ResourceNotFoundError()

    const post = await this.postsRepository.findByPublicId(postId)
    if (!post) throw new PostNotFoundError()
      
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
