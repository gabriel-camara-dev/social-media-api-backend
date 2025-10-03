import {
  PostsRepository,
  PostsWithAuthor,
} from '../../repositories/posts-repository'

interface CreatePostUseCaseRequest {
  userId: string
  content: string
  image?: string
}

interface CreatePostUseCaseResponse {
  post: PostsWithAuthor
}

export class CreatePostUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    userId,
    content,
    image,
  }: CreatePostUseCaseRequest): Promise<CreatePostUseCaseResponse> {
    const post = await this.postsRepository.create({
      userId,
      content,
      image: image || null,
    })

    return {
      post,
    }
  }
}
