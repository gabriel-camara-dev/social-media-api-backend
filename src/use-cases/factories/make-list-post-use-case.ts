import { PrismaPostsRepository } from '../../repositories/prisma/prisma-posts-repository'
import { ListPostByPublicIdPostUseCase } from '../posts/list-post-by-public-id-use-case'

export function makeListPostUseCase() {
  const postsRepository = new PrismaPostsRepository()
  const listPostUseCase = new ListPostByPublicIdPostUseCase(postsRepository)

  return listPostUseCase
}