import { PrismaNotificationsRepository } from '../../repositories/prisma/prisma-notifications-repository'
import { NotificationService } from '../services/notification-service'
import { PrismaPostsRepository } from '../../repositories/prisma/prisma-posts-repository'
import { PrismaCommentsRepository } from '../../repositories/prisma/prisma-comments-repository'

export function makeNotificationService() {
  const notificationsRepository = new PrismaNotificationsRepository()
  const postsRepository = new PrismaPostsRepository()
  const commentsRepository = new PrismaCommentsRepository()

  const notificationService = new NotificationService(
    notificationsRepository,
    postsRepository,
    commentsRepository
  )
  return notificationService
}
