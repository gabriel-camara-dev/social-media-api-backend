import { describe, it, expect, beforeEach } from 'vitest'
import { ToggleRepostUseCase } from './toggle-repost-use-case'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { InMemoryRepostsRepository } from '../../repositories/in-memory/in-memory-reposts-repository'

describe('ToggleRepostUseCase', () => {
  let repostsRepository: InMemoryRepostsRepository
  let useCase: ToggleRepostUseCase

  beforeEach(() => {
    repostsRepository = new InMemoryRepostsRepository()
    useCase = new ToggleRepostUseCase(repostsRepository)
  })

  it('should create a repost if it does not exist', async () => {
    const userId = 'user-1'
    const postId = 'post-1'

    await useCase.execute({ userId, postId })

    const repost = await repostsRepository.findByUserAndContent(userId, postId)
    expect(repost).not.toBeNull()
    expect(repost?.userId).toBe(userId)
    expect(repost?.postId).toBe(postId)
  })

  it('should delete a repost if it already exists', async () => {
    const userId = 'user-1'
    const postId = 'post-1'

    await repostsRepository.create({ userId, postId })

    await useCase.execute({ userId, postId })

    const repost = await repostsRepository.findByUserAndContent(userId, postId)
    expect(repost).toBeNull()
  })

  it('should toggle repost for a comment', async () => {
    const userId = 'user-1'
    const commentId = 'comment-1'

    await useCase.execute({ userId, commentId })
    let repost = await repostsRepository.findByUserAndContent(
      userId,
      undefined,
      commentId
    )
    expect(repost).not.toBeNull()

    await useCase.execute({ userId, commentId })
    repost = await repostsRepository.findByUserAndContent(
      userId,
      undefined,
      commentId
    )
    expect(repost).toBeNull()
  })

  it('should throw ResourceNotFoundError if neither postId nor commentId is provided', async () => {
    await expect(
      useCase.execute({
        userId: 'user-1',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
