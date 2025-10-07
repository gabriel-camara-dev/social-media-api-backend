import { beforeEach, describe, it, expect, vi } from 'vitest'
import { InMemoryCommentsRepository } from '../../repositories/in-memory/in-memory-comments-repository'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { DeleteCommentUseCase } from './delete-comment-use-case'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

vi.mock('../../utils/upload', () => ({
  UploadService: {
    deleteFile: vi.fn().mockResolvedValue(undefined),
  },
}))

describe('DeleteCommentUseCase', () => {
  let commentsRepository: InMemoryCommentsRepository
  let usersRepository: InMemoryUsersRepository
  let postsRepository: InMemoryPostsRepository
  let deleteCommentUseCase: DeleteCommentUseCase
  let user: any
  let post: any

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    postsRepository = new InMemoryPostsRepository()
    commentsRepository = new InMemoryCommentsRepository()
    deleteCommentUseCase = new DeleteCommentUseCase(commentsRepository)

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

  it('should delete a comment successfully', async () => {
    const comment = await commentsRepository.create({
      authorId: user.publicId,
      postId: post.publicId,
      content: 'Test comment',
    })

    const result = await deleteCommentUseCase.execute({
      commentPublicId: comment.publicId,
      authorId: user.publicId,
    })

    expect(result.success).toBe(true)

    const deletedComment = await commentsRepository.findByPublicId(
      comment.publicId
    )
    expect(deletedComment).toBeNull()
  })

  it('should throw ResourceNotFoundError when comment does not exist', async () => {
    await expect(
      deleteCommentUseCase.execute({
        commentPublicId: 'non-existent-comment',
        authorId: user.publicId,
      })
    ).rejects.toThrow(ResourceNotFoundError)
  })

  it('should throw Unauthorized error when authorId does not match', async () => {
    const comment = await commentsRepository.create({
      authorId: user.publicId,
      postId: post.publicId,
      content: 'Test comment',
    })

    await expect(
      deleteCommentUseCase.execute({
        commentPublicId: comment.publicId,
        authorId: 'different-user',
      })
    ).rejects.toThrow('Unauthorized')
  })

  it('should delete image file when comment has image', async () => {
    const { UploadService } = await import('../../utils/upload')

    const comment = await commentsRepository.create({
      authorId: user.publicId,
      postId: post.publicId,
      content: 'Test comment',
      image: 'test-image.jpg',
    })

    await deleteCommentUseCase.execute({
      commentPublicId: comment.publicId,
      authorId: user.publicId,
    })

    expect(UploadService.deleteFile).toHaveBeenCalledWith('test-image.jpg')
  })
})
