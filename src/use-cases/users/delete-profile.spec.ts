import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { DeleteProfileUseCase } from './delete-profile-use-case'

describe('DeleteProfileUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let deleteProfileUseCase: DeleteProfileUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    deleteProfileUseCase = new DeleteProfileUseCase(usersRepository)
  })

  it('should delete user profile successfully', async () => {
    const user = await usersRepository.create({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      passwordDigest: 'hashed-password',
    })

    await deleteProfileUseCase.execute({
      userId: user.publicId,
    })

    const deletedUser = await usersRepository.findByPublicId(user.publicId)
    expect(deletedUser).toBeNull()
  })

  it('should not throw error when deleting non-existent user', async () => {
    await expect(
      deleteProfileUseCase.execute({
        userId: 'non-existent-user',
      })
    ).resolves.not.toThrow()
  })
})
