import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { FollowOrUnfollowUseCase } from '../users/follow-or-unfollow-use-case'

export function makeFollowOrUnfollowUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const followOrUnfollowUseCase = new FollowOrUnfollowUseCase(usersRepository)

  return followOrUnfollowUseCase
}