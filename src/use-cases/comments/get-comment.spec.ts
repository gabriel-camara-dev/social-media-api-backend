import { beforeEach, describe, it, expect } from 'vitest'
import { InMemoryCommentsRepository } from '../../repositories/in-memory/in-memory-comments-repository'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { GetCommentUseCase } from './get-comment-use-case'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

describe('GetCommentUseCase', () => {
  let commentsRepository: InMemoryCommentsRepository
  let usersRepository: InMemoryUsersRepository
  let postsRepository: InMemoryPostsRepository
  let getCommentUseCase: GetCommentUseCase
  let user: any
  let post: any

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    postsRepository = new InMemoryPostsRepository()
    commentsRepository = new InMemoryCommentsRepository()
    getCommentUseCase = new GetCommentUseCase(commentsRepository)

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

  it('should get a comment successfully', async () => {
    const createdComment = await commentsRepository.create({
      authorId: user.publicId,
      postId: post.publicId,
      content: 'Test comment',
    })

    const result = await getCommentUseCase.execute({
      publicId: createdComment.publicId,
    })

    expect(result.comment.publicId).toBe(createdComment.publicId)
    expect(result.comment.content).toBe('Test comment')
    expect(result.comment.authorId).toBe(user.publicId)
    expect(result.comment.postId).toBe(post.publicId)
    expect(result.comment.author).toBeDefined()
  })

  it('should throw ResourceNotFoundError when comment does not exist', async () => {
    await expect(
      getCommentUseCase.execute({
        publicId: 'non-existent-comment',
      })
    ).rejects.toThrow(ResourceNotFoundError)
  })

  it('should return comment with author data', async () => {
    const createdComment = await commentsRepository.create({
      authorId: user.publicId,
      postId: post.publicId,
      content: 'Test comment',
    })

    const result = await getCommentUseCase.execute({
      publicId: createdComment.publicId,
    })

    expect(result.comment.author).toBeDefined()
    expect(result.comment.author.publicId).toBe(user.publicId)
    expect(result.comment.author.name).toBe(user.name)
    expect(result.comment.author.username).toBe(user.username)
  })
})