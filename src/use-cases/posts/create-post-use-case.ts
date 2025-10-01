import { PostsRepository, PostsWithAuthor } from '../../repositories/posts-repository'

interface CreatePostUseCaseRequest {
  userId: string
  content: string
}

interface CreatePostUseCaseResponse {
  post: PostsWithAuthor
}

export class CreatePostUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    userId,
    content,
  }: CreatePostUseCaseRequest): Promise<CreatePostUseCaseResponse> {
    const post = await this.postsRepository.create({
      userId,
      content,
    })

    return {
      post,
    }
  }
}
