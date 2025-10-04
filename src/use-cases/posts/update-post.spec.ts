import { beforeEach, describe, expect, it } from 'vitest'
import { UsersRepository } from '../../repositories/users-repository'
import { PostsRepository } from '../../repositories/posts-repository'
import { ListPostByPublicIdPostUseCase } from './list-post-by-public-id-use-case'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { PostNotFoundError } from '../errors/post-not-found-error'
import { Comment } from '@prisma/client'
import { UpdatePostUseCase } from './update-post-use-case'

describe('UpdatePostUseCase', () => {
  let usersRepository: UsersRepository
  let postsRepository: InMemoryPostsRepository
  let updatePostUseCase: UpdatePostUseCase
  let user: any

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    postsRepository = new InMemoryPostsRepository()
    updatePostUseCase = new UpdatePostUseCase(postsRepository)

    user = await usersRepository.create({
      name: 'user',
      username: 'user',
      email: 'user@gmail.com',
      passwordDigest: 'hashed-password',
    })
  })

  it('should throw PostNotFoundError when posts doesnt exist', async () => {
    await expect(
      updatePostUseCase.execute({
        publicId: 'random-publicId',
        data: {
          content: 'updated',
        },
      })
    ).rejects.toBeInstanceOf(PostNotFoundError)
  })

  it('should update post successfully', async () => {
    const post = await postsRepository.create({
      userId: user.publicId,
      content: 'conteudo',
    })

    const updatedPost = await updatePostUseCase.execute({
      publicId: post.publicId,
      data: {
        content: 'updated',
      },
    })

    expect(await updatedPost.post.content).toBe('updated')
  })
})
