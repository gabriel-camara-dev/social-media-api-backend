import { PostsRepository } from '../../repositories/posts-repository'
import { PostNotFoundError } from '../errors/post-not-found-error'

interface DeletePostUseCaseRequest {
  publicId: string
}

export class DeletePostUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({ publicId }: DeletePostUseCaseRequest) {
    const post = await this.postsRepository.findByPublicId(publicId)

    if (!post) {
      throw new PostNotFoundError()
    }

    await this.postsRepository.delete(publicId)
  }
}
