import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { FollowOrUnfollowUseCase } from '../users/follow-or-unfollow-use-case'
import { makeNotificationService } from './make-notification-service'

export function makeFollowOrUnfollowUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const notificationService = makeNotificationService()
  const followOrUnfollowUseCase = new FollowOrUnfollowUseCase(
    usersRepository,
    notificationService
  )

  return followOrUnfollowUseCase
}
