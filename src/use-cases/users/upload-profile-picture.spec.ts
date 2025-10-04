import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { UploadProfilePictureUseCase } from './upload-profile-picture-use-case'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

vi.mock('../../utils/upload', () => ({
  UploadService: {
    deleteFile: vi.fn().mockResolvedValue(undefined),
  },
}))

import { UploadService } from '../../utils/upload'

describe('UploadProfilePictureUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let uploadProfilePictureUseCase: UploadProfilePictureUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    uploadProfilePictureUseCase = new UploadProfilePictureUseCase(
      usersRepository
    )
    vi.clearAllMocks()
  })

  it('should upload profile picture successfully', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      passwordDigest: 'hashed-password',
    })

    const filename = 'profile-picture.jpg'

    const result = await uploadProfilePictureUseCase.execute({
      publicId: user.publicId,
      filename,
    })

    expect(result.success).toBe(true)
    expect(result.profilePicture).toBe(filename)
  })

  it('should delete old profile picture when replacing', async () => {
    const oldFilename = 'old-profile-picture.jpg'
    const user = await usersRepository.create({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      passwordDigest: 'hashed-password',
      profilePicture: oldFilename,
    })

    const newFilename = 'new-profile-picture.jpg'

    await uploadProfilePictureUseCase.execute({
      publicId: user.publicId,
      filename: newFilename,
    })

    expect(UploadService.deleteFile).toHaveBeenCalledWith(oldFilename)
    expect(UploadService.deleteFile).toHaveBeenCalledTimes(1)
  })

  it('should throw error for non-existent user', async () => {
    await expect(
      uploadProfilePictureUseCase.execute({
        publicId: 'non-existent',
        filename: 'profile.jpg',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})