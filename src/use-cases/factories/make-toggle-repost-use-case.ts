import { PrismaRepostRepository } from '../../repositories/prisma/prisma-reposts-repository'
import { ToggleRepostUseCase } from '../reposts/toggle-repost-use-case'

export function makeToggleRepostUseCase() {
  const repostsRepository = new PrismaRepostRepository()
  const toggleRepostUseCase = new ToggleRepostUseCase(repostsRepository)

  return toggleRepostUseCase
}