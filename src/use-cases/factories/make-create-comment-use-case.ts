import { PrismaCommentsRepository } from '../../repositories/prisma/prisma-comments-repository'
import { CreateCommentUseCase } from '../comments/create-comment-use-case'

export function makeCreateCommentUseCase() {
  const commentsRepository = new PrismaCommentsRepository()
  const createCommentUseCase = new CreateCommentUseCase(commentsRepository)

  return createCommentUseCase
}