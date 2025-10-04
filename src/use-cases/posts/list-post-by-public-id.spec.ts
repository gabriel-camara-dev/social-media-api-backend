import { beforeEach, describe, expect, it } from 'vitest'
import { UsersRepository } from '../../repositories/users-repository'
import { PostsRepository } from '../../repositories/posts-repository'
import { ListPostByPublicIdPostUseCase } from './list-post-by-public-id-use-case'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { PostNotFoundError } from '../errors/post-not-found-error'
import { Comment } from '@prisma/client'

describe('ListPostByPublicId', () => {
  let usersRepository: UsersRepository
  let postsRepository: InMemoryPostsRepository
  let listPostByPublicIdPostUseCase: ListPostByPublicIdPostUseCase
  let user: any

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    postsRepository = new InMemoryPostsRepository()
    listPostByPublicIdPostUseCase = new ListPostByPublicIdPostUseCase(
      postsRepository
    )

    user = await usersRepository.create({
      name: 'user',
      username: 'user',
      email: 'user@gmail.com',
      passwordDigest: 'hashed-password',
    })
  })

  it('should throw PostNotFoundError when posts doesnt exist', async () => {
    const options = {
      commentsLimit: undefined,
      repliesLimit: undefined,
    }

    await expect(
      listPostByPublicIdPostUseCase.execute({
        publicId: 'random-publicId',
        options,
      })
    ).rejects.toBeInstanceOf(PostNotFoundError)
  })

  it('should return post with comments and replies limits', async () => {
    const post = await postsRepository.create({
      content: 'Test post',
      userId: user.publicId,
    })

    for (let i = 1; i <= 15; i++) {
      const comment: Comment = {
        id: i,
        publicId: `comment-${i}`,
        content: `Comment ${i}`,
        image: null,
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: user.publicId,
        postId: post.publicId,
        parentId: null,
      }
      postsRepository.comments.push(comment)

      for (let j = 1; j <= 2; j++) {
        const reply: Comment = {
          id: 100 + i * 10 + j,
          publicId: `reply-${i}-${j}`,
          content: `Reply ${j} to comment ${i}`,
          image: null,
          likes: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: user.publicId,
          postId: post.publicId,
          parentId: `comment-${i}`,
        }
        postsRepository.comments.push(reply)
      }
    }

    const options = {
      commentsLimit: 5,
      repliesLimit: 1,
    }

    const result = await listPostByPublicIdPostUseCase.execute({
      publicId: post.publicId,
      options,
    })

    expect(result.post.comments).toHaveLength(5)
    expect(result.post.totalPages).toBe(3)

    result.post.comments.forEach((comment) => {
      expect(comment.replies?.length).toBeLessThanOrEqual(1)
    })

    if (result.post.comments[0].replies) {
      expect(result.post.comments[0].replies).toHaveLength(1)
    }
  })

  it('should use default limits when options are not provided', async () => {
    const post = await postsRepository.create({
      content: 'Test post',
      userId: user.publicId,
    })

    const result = await listPostByPublicIdPostUseCase.execute({
      publicId: post.publicId,
    })

    expect(result.post).toBeDefined()
    expect(result.post.comments).toBeDefined()
    expect(Array.isArray(result.post.comments)).toBe(true)
  })
})
