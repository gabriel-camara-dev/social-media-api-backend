import { describe, it, beforeEach, expect, vi } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { DeletePostUseCase } from './delete-post-use-case'
import { PostNotFoundError } from '../errors/post-not-found-error'
import { UploadService } from '../../utils/upload'

vi.mock('../../utils/upload', () => ({
  UploadService: {
    compressImage: vi.fn().mockResolvedValue('compressed-image.jpg'),
    deleteFile: vi.fn().mockResolvedValue(undefined),
  },
}))

describe('DeletePostUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let postsRepository: InMemoryPostsRepository
  let deletePostUseCase: DeletePostUseCase
  let user: any

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    postsRepository = new InMemoryPostsRepository()
    deletePostUseCase = new DeletePostUseCase(postsRepository)

    user = await usersRepository.create({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      passwordDigest: 'hashed-password',
    })

    vi.clearAllMocks()
  })

  it('should throw PostNotFoundError when Post doesnt exist', async () => {
    const publicId = 'random-publicId'

    await expect(
      deletePostUseCase.execute({ publicId })
    ).rejects.toBeInstanceOf(PostNotFoundError)
  })

  it('should delete post when a image is attached', async () => {
    const post = await postsRepository.create({
      userId: user.publicId,
      content: 'conteudo',
      image: 'compressed-image.jpg',
    })

    await deletePostUseCase.execute({ publicId: post.publicId })

    expect(UploadService.deleteFile).toHaveBeenCalledWith(
      'compressed-image.jpg'
    )
  })

  it('should delete post when a image is not attached', async () => {
    const post = await postsRepository.create({
      userId: user.publicId,
      content: 'conteudo',
    })

    await deletePostUseCase.execute({ publicId: post.publicId })

    expect(UploadService.deleteFile).not.toHaveBeenCalled()
  })
})
