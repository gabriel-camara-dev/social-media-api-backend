import { PrismaPostsRepository } from '../../repositories/prisma/prisma-posts-repository'
import { CreatePostUseCase } from '../posts/create-post-use-case'

export function makeCreatePostUseCase() {
  const postsRepository = new PrismaPostsRepository()
  const createPostUseCase = new CreatePostUseCase(postsRepository)

  return createPostUseCase
}