import { PrismaCommentsRepository } from '../../repositories/prisma/prisma-comments-repository'
import { UpdateCommentUseCase } from '../comments/update-comment-use-case'

export function makeUpdateCommentUseCase() {
  const commentsRepository = new PrismaCommentsRepository()
  const updateCommentUseCase = new UpdateCommentUseCase(commentsRepository)

  return updateCommentUseCase
}