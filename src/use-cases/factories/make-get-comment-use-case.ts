import { PrismaCommentsRepository } from '../../repositories/prisma/prisma-comments-repository'
import { GetCommentUseCase } from '../comments/get-comment-use-case'

export function makeGetCommentUseCase() {
  const commentsRepository = new PrismaCommentsRepository()
  const getCommentUseCase = new GetCommentUseCase(commentsRepository)

  return getCommentUseCase
}
