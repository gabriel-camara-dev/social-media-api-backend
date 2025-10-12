import { PrismaCommentsRepository } from '../../repositories/prisma/prisma-comments-repository'
import { PrismaPostsRepository } from '../../repositories/prisma/prisma-posts-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { CreateCommentUseCase } from '../comments/create-comment-use-case'
import { makeNotificationService } from './make-notification-service'

export function makeCreateCommentUseCase() {
  const commentsRepository = new PrismaCommentsRepository()
  const usersRepository = new PrismaUsersRepository()
  const postsRepository = new PrismaPostsRepository()
  const notificationService = makeNotificationService()
  const createCommentUseCase = new CreateCommentUseCase(
    commentsRepository,
    usersRepository,
    postsRepository,
    notificationService
  )

  return createCommentUseCase
}
