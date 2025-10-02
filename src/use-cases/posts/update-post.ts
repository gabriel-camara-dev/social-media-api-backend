import {
  PostsRepository,
  PostsWithAuthor,
} from '../../repositories/posts-repository'
import { PostNotFoundError } from '../errors/post-not-found-error'

interface UpdatePostUseCaseRequest {
  publicId: string
  data: {
    content?: string
  }
}

interface UpdatePostUseCaseResponse {
  post: PostsWithAuthor
}

export class UpdatePostUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    publicId,
    data,
  }: UpdatePostUseCaseRequest): Promise<UpdatePostUseCaseResponse> {
    const exists = await this.postsRepository.findByPublicId(publicId)

    if (!exists) {
      throw new PostNotFoundError()
    }

    const post = await this.postsRepository.update(publicId, data)

    return {
      post,
    }
  }
}
