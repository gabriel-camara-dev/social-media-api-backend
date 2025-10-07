import { PrismaCommentsRepository } from '../../repositories/prisma/prisma-comments-repository'
import { PrismaLikeRepository } from '../../repositories/prisma/prisma-like-repository'
import { PrismaPostsRepository } from '../../repositories/prisma/prisma-posts-repository'
import { ToggleLikeUseCase } from '../likes/toggle-like-use-case'
import { makeNotificationService } from './make-notification-service'

export function makeToggleLikeUseCase() {
  const postsRepository = new PrismaPostsRepository()
  const commentsRepository = new PrismaCommentsRepository()
  const likesRepository = new PrismaLikeRepository()
  const notificationService = makeNotificationService()

  const toggleLikeUseCase = new ToggleLikeUseCase(
    postsRepository,
    likesRepository,
    commentsRepository,
    notificationService
  )

  return toggleLikeUseCase
}