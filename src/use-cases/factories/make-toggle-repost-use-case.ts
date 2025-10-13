import { PrismaRepostRepository } from '../../repositories/prisma/prisma-reposts-repository'
import { ToggleRepostUseCase } from '../reposts/toggle-repost-use-case'
import { makeNotificationService } from './make-notification-service'

export function makeToggleRepostUseCase() {
  const repostsRepository = new PrismaRepostRepository()
  const notificationService = makeNotificationService()

  return new ToggleRepostUseCase(repostsRepository, notificationService)
}
