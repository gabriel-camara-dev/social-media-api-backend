import { PrismaCommentsRepository } from '../../repositories/prisma/prisma-comments-repository'
import { DeleteCommentUseCase } from '../comments/delete-comment-use-case'

export function makeDeleteCommentUseCase() {
  const commentsRepository = new PrismaCommentsRepository()
  const deleteCommentUseCase = new DeleteCommentUseCase(commentsRepository)

  return deleteCommentUseCase
}