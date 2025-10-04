import { describe, it, beforeEach, expect, vi } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { CreatePostUseCase } from './create-post-use-case'

// Mock do UploadService
vi.mock('../../../utils/upload', () => ({
  UploadService: {
    compressImage: vi.fn().mockResolvedValue('compressed-image.jpg'),
  },
}))

describe('CreatePostUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let postsRepository: InMemoryPostsRepository
  let createPostUseCase: CreatePostUseCase
  let user: any

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    postsRepository = new InMemoryPostsRepository()
    createPostUseCase = new CreatePostUseCase(postsRepository)

    user = await usersRepository.create({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      passwordDigest: 'hashed-password',
    })
  })

  it('should create post successfully with compressed image', async () => {
    const postData = {
      content: 'Test post content',
      image: 'compressed-image.jpg',
      userId: user.publicId,
    }

    const post = await createPostUseCase.execute(postData)

    expect(post).toBeDefined()
    expect(post.post.content).toBe(postData.content)
    expect(post.post.image).toBe(postData.image)
    expect(post.post.userId).toBe(user.publicId)
  })

  it('should create post successfully without image', async () => {
    const postData = {
      content: 'Test post content',
      userId: user.publicId,
    }

    const post = await createPostUseCase.execute(postData)

    expect(post).toBeDefined()
    expect(post.post.content).toBe(postData.content)
    expect(post.post.userId).toBe(user.publicId)
  })
})
