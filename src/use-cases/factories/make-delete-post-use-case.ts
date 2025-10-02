import { PrismaPostsRepository } from '../../repositories/prisma/prisma-posts-repository'
import { DeletePostUseCase } from '../posts/delete-post'

export function makeDeletePostUseCase() {
  const postsRepository = new PrismaPostsRepository()
  const deletePostUseCase = new DeletePostUseCase(postsRepository)

  return deletePostUseCase
}