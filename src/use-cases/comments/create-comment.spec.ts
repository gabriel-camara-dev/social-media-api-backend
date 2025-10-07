import { beforeEach, describe, it, expect, vi } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { InMemoryCommentsRepository } from '../../repositories/in-memory/in-memory-comments-repository'
import { CreateCommentUseCase } from './create-comment-use-case'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { PostNotFoundError } from '../errors/post-not-found-error'

vi.mock('../../../utils/upload', () => ({
  UploadService: {
    compressImage: vi.fn().mockResolvedValue('compressed-image.jpg'),
  },
}))

describe('CreateCommentUseCase', () => {
  let commentsRepository: InMemoryCommentsRepository
  let usersRepository: InMemoryUsersRepository
  let postsRepository: InMemoryPostsRepository
  let createCommentUseCase: CreateCommentUseCase
  let user: any
  let post: any

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    postsRepository = new InMemoryPostsRepository()
    commentsRepository = new InMemoryCommentsRepository()
    createCommentUseCase = new CreateCommentUseCase(
      commentsRepository,
      usersRepository,
      postsRepository
    )

    user = await usersRepository.create({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      passwordDigest: 'hashed-password',
    })

    post = await postsRepository.create({
      userId: user.publicId,
      content: 'Olá',
    })
  })

  it('should create a comment successfully', async () => {
    const result = await createCommentUseCase.execute({
      authorId: user.publicId,
      postId: post.publicId,
      content: 'Test comment',
    })

    expect(result.comment.content).toBe('Test comment')
    expect(result.comment.authorId).toBe(user.publicId)
    expect(result.comment.postId).toBe(post.publicId)
  })

  it('should throw ResourceNotFoundError when user does not exist', async () => {
    await expect(
      createCommentUseCase.execute({
        authorId: 'non-existent-user',
        postId: post.publicId,
        content: 'Test comment',
      })
    ).rejects.toThrow(ResourceNotFoundError)
  })

  it('should throw PostNotFoundError when post does not exist', async () => {
    await expect(
      createCommentUseCase.execute({
        authorId: user.publicId,
        postId: 'non-existent-post',
        content: 'Test comment',
      })
    ).rejects.toThrow(PostNotFoundError)
  })

  it('should create a comment with parentId', async () => {
    const parentComment = await commentsRepository.create({
      authorId: user.publicId,
      postId: post.publicId,
      content: 'Parent comment',
    })

    const result = await createCommentUseCase.execute({
      authorId: user.publicId,
      postId: post.publicId,
      content: 'Reply comment',
      parentId: parentComment.publicId,
    })

    expect(result.comment.content).toBe('Reply comment')
    expect(result.comment.parentId).toBe(parentComment.publicId)
  })

  it('should create a comment with image', async () => {
    const result = await createCommentUseCase.execute({
      authorId: user.publicId,
      postId: post.publicId,
      content: 'Comment with image',
      image: 'test-image.jpg',
    })

    expect(result.comment.content).toBe('Comment with image')
    expect(result.comment.image).toBe('test-image.jpg')
  })

  it('should return comment with author data', async () => {
    const result = await createCommentUseCase.execute({
      authorId: user.publicId,
      postId: post.publicId,
      content: 'Test comment',
    })

    expect(result.comment.author).toBeDefined()
    expect(result.comment.author.publicId).toBe(user.publicId)
    expect(result.comment.author.name).toBe(user.name)
    expect(result.comment.author.username).toBe(user.username)
  })
})