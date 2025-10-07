import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { GetUserContentUseCase } from './get-user-content-use-case'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { InMemoryRepostsRepository } from '../../repositories/in-memory/in-memory-reposts-repository'

describe('GetUserContentUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let postsRepository: InMemoryPostsRepository
  let repostsRepository: InMemoryRepostsRepository
  let useCase: GetUserContentUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    postsRepository = usersRepository.postsRepository
    repostsRepository = usersRepository.repostsRepository
    useCase = new GetUserContentUseCase(usersRepository)
  })

  it('should get user content sorted by creation date', async () => {
    const user = await usersRepository.create({
      name: 'Content Creator',
      username: 'creator',
      email: 'creator@example.com',
      passwordDigest: 'hashed-password',
    })

    const post1 = await postsRepository.create({
      userId: user.publicId,
      content: 'First post',
    })
    await new Promise((resolve) => setTimeout(resolve, 10))
    const repost1 = await repostsRepository.create({
      userId: user.publicId,
      postId: 'some-other-post-id',
    })
    await new Promise((resolve) => setTimeout(resolve, 10))
    const post2 = await postsRepository.create({
      userId: user.publicId,
      content: 'Second post',
    })

    const { content } = await useCase.execute({
      publicId: user.publicId,
      page: 1,
      limit: 10,
    })

    expect(content).toHaveLength(3)
    expect(content[0].publicId).toBe(post2.publicId)
    expect(content[1].publicId).toBe(repost1.publicId)
    expect(content[2].publicId).toBe(post1.publicId)
  })

  it('should paginate user content correctly', async () => {
    const user = await usersRepository.create({
      name: 'Content Creator',
      username: 'creator',
      email: 'creator@example.com',
      passwordDigest: 'hashed-password',
    })

    for (let i = 0; i < 5; i++) {
      await postsRepository.create({
        userId: user.publicId,
        content: `Post ${i}`,
      })
      await new Promise((resolve) => setTimeout(resolve, 5))
    }

    const { content: page1 } = await useCase.execute({
      publicId: user.publicId,
      page: 1,
      limit: 2,
    })
    const { content: page2 } = await useCase.execute({
      publicId: user.publicId,
      page: 2,
      limit: 2,
    })

    expect(page1).toHaveLength(2)
    expect(page2).toHaveLength(2)
    expect((page1[0] as any).content).toBe('Post 4')
    expect((page2[0] as any).content).toBe('Post 2')
  })
})
