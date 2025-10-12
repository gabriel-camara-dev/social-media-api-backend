import { PrismaPostsRepository } from '../../repositories/prisma/prisma-posts-repository'
import { PrismaCommentsRepository } from '../../repositories/prisma/prisma-comments-repository'
import { NotificationService } from '../services/notification-service'

export function makeNotificationService() {
  const postsRepository = new PrismaPostsRepository()
  const commentsRepository = new PrismaCommentsRepository()
  return new NotificationService(postsRepository, commentsRepository)
}
