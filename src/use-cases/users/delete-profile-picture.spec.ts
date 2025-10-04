import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { DeleteProfilePictureUseCase } from './delete-profile-picture-use-case'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

vi.mock('../../utils/upload', () => ({
  UploadService: {
    deleteFile: vi.fn().mockResolvedValue({ success: true }),
  },
}))

import { UploadService } from '../../utils/upload'

describe('DeleteProfilePictureUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let deleteProfilePictureUseCase: DeleteProfilePictureUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    deleteProfilePictureUseCase = new DeleteProfilePictureUseCase(
      usersRepository
    )
    vi.clearAllMocks()
  })

  it('should delete profile picture successfully', async () => {
    const user = await usersRepository.create({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      passwordDigest: 'hashed-password',
      profilePicture: 'profile-picture.jpg',
    })

    const result = await deleteProfilePictureUseCase.execute({
      publicId: user.publicId,
    })

    expect(result.success).toBe(true)
    expect(UploadService.deleteFile).toHaveBeenCalledWith('profile-picture.jpg')
    
    const updatedUser = await usersRepository.findByPublicId(user.publicId)
    expect(updatedUser?.profilePicture).toBeNull()
  })

  it('should throw ResourceNotFoundError when user does not exist', async () => {
    await expect(
      deleteProfilePictureUseCase.execute({
        publicId: 'non-existent-user',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

    expect(UploadService.deleteFile).not.toHaveBeenCalled()
  })

  it('should throw ResourceNotFoundError when user has no profile picture', async () => {
    const user = await usersRepository.create({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      passwordDigest: 'hashed-password',
      profilePicture: null,
    })

    await expect(
      deleteProfilePictureUseCase.execute({
        publicId: user.publicId,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

    expect(UploadService.deleteFile).not.toHaveBeenCalled()
  })

  it('should throw error when file deletion fails', async () => {
    vi.mocked(UploadService.deleteFile).mockResolvedValueOnce({ success: false })

    const user = await usersRepository.create({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      passwordDigest: 'hashed-password',
      profilePicture: 'profile-picture.jpg',
    })

    await expect(
      deleteProfilePictureUseCase.execute({
        publicId: user.publicId,
      })
    ).rejects.toThrow('Error deleting profile picture file')

    const updatedUser = await usersRepository.findByPublicId(user.publicId)
    expect(updatedUser?.profilePicture).toBe('profile-picture.jpg')
  })
})