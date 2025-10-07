import { beforeEach, describe, it, expect } from 'vitest'
import { InMemoryCommentsRepository } from '../../repositories/in-memory/in-memory-comments-repository'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { UpdateCommentUseCase } from './update-comment-use-case'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

describe('UpdateCommentUseCase', () => {
  let commentsRepository: InMemoryCommentsRepository
  let usersRepository: InMemoryUsersRepository
  let postsRepository: InMemoryPostsRepository
  let updateCommentUseCase: UpdateCommentUseCase
  let user: any
  let post: any

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    postsRepository = new InMemoryPostsRepository()
    commentsRepository = new InMemoryCommentsRepository()
    updateCommentUseCase = new UpdateCommentUseCase(commentsRepository)

    user = await usersRepository.create({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      passwordDigest: 'hashed-password',
    })

    post = await postsRepository.create({
      userId: user.publicId,
      content: 'Test post',
    })
  })

  it('should update a comment successfully', async () => {
    const comment = await commentsRepository.create({
      authorId: user.publicId,
      postId: post.publicId,
      content: 'Original content',
    })

    const result = await updateCommentUseCase.execute({
      commentPublicId: comment.publicId,
      authorId: user.publicId,
      content: 'Updated content',
    })

    expect(result.comment.content).toBe('Updated content')
    expect(result.comment.publicId).toBe(comment.publicId)
    expect(result.comment.authorId).toBe(user.publicId)
  })

  it('should throw ResourceNotFoundError when comment does not exist', async () => {
    await expect(
      updateCommentUseCase.execute({
        commentPublicId: 'non-existent-comment',
        authorId: user.publicId,
        content: 'Updated content',
      })
    ).rejects.toThrow(ResourceNotFoundError)
  })

  it('should throw Unauthorized error when authorId does not match', async () => {
    const comment = await commentsRepository.create({
      authorId: user.publicId,
      postId: post.publicId,
      content: 'Original content',
    })

    await expect(
      updateCommentUseCase.execute({
        commentPublicId: comment.publicId,
        authorId: 'different-user',
        content: 'Updated content',
      })
    ).rejects.toThrow('Unauthorized')
  })

  it('should return updated comment with author data', async () => {
    const comment = await commentsRepository.create({
      authorId: user.publicId,
      postId: post.publicId,
      content: 'Original content',
    })

    const result = await updateCommentUseCase.execute({
      commentPublicId: comment.publicId,
      authorId: user.publicId,
      content: 'Updated content',
    })

    expect(result.comment.author).toBeDefined()
    expect(result.comment.author.publicId).toBe(user.publicId)
    expect(result.comment.author.name).toBe(user.name)
    expect(result.comment.author.username).toBe(user.username)
  })
})
