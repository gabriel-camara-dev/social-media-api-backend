import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { InMemoryCommentsRepository } from '../../repositories/in-memory/in-memory-comments-repository'
import { InMemoryLikeRepository } from '../../repositories/in-memory/in-memory-like-repository'
import { ToggleLikeUseCase } from './toggle-like-use-case'
import { PostNotFoundError } from '../errors/post-not-found-error'

describe('ToggleLikeUseCase', () => {
  let postsRepository: InMemoryPostsRepository
  let commentsRepository: InMemoryCommentsRepository
  let likesRepository: InMemoryLikeRepository
  let toggleLikeUseCase: ToggleLikeUseCase

  beforeEach(() => {
    postsRepository = new InMemoryPostsRepository()
    commentsRepository = new InMemoryCommentsRepository()
    likesRepository = new InMemoryLikeRepository()
    toggleLikeUseCase = new ToggleLikeUseCase(
      postsRepository,
      likesRepository,
      commentsRepository
    )
  })

  it('should like a post successfully', async () => {
    const post = await postsRepository.create({
      content: 'Test post',
      userId: 'user-123',
    })

    await expect(
      toggleLikeUseCase.execute({
        userId: 'user-456',
        postId: post.publicId,
      })
    ).resolves.not.toThrow()
  })

  it('should unlike a post successfully', async () => {
    const post = await postsRepository.create({
      content: 'Test post',
      userId: 'user-123',
    })

    await toggleLikeUseCase.execute({
      userId: 'user-456',
      postId: post.publicId,
    })

    await expect(
      toggleLikeUseCase.execute({
        userId: 'user-456',
        postId: post.publicId,
      })
    ).resolves.not.toThrow()
  })

  it('should throw error when post does not exist', async () => {
    await expect(
      toggleLikeUseCase.execute({
        userId: 'user-456',
        postId: 'non-existent-post',
      })
    ).rejects.toBeInstanceOf(PostNotFoundError)
  })

  it('should throw error when neither postId nor commentId is provided', async () => {
    await expect(
      toggleLikeUseCase.execute({
        userId: 'user-456',
      })
    ).rejects.toThrow()
  })
})
