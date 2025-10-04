import {
  PostsRepository,
  PostWithComments,
} from '../../repositories/posts-repository'
import { PostNotFoundError } from '../errors/post-not-found-error'

interface ListPostByPublicIdUseCaseRequest {
  publicId: string
  options?: {
    commentsLimit?: number
    repliesLimit?: number
  }
}

interface ListPostByPublicIdUseCaseResponse {
  post: PostWithComments
}

export class ListPostByPublicIdPostUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    publicId,
    options,
  }: ListPostByPublicIdUseCaseRequest): Promise<ListPostByPublicIdUseCaseResponse> {
    const post = await this.postsRepository.findByPublicId(publicId, options)

    if (!post) {
      throw new PostNotFoundError()
    }

    return {
      post,
    }
  }
}
