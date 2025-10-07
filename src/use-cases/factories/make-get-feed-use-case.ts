import { PrismaPostsRepository } from '../../repositories/prisma/prisma-posts-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { GetFeedUseCase } from '../posts/get-feed-use-case'

export function makeGetFeedUseCase() {
  const postsRepository = new PrismaPostsRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetFeedUseCase(postsRepository, usersRepository)
  return useCase
}
