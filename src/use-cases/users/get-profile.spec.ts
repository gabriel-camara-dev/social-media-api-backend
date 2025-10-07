import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { GetProfileUseCase } from './get-profile-use-case'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

describe('GetProfileUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let getProfileUseCase: GetProfileUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    getProfileUseCase = new GetProfileUseCase(usersRepository)
  })

  it('should get user profile successfully', async () => {
    const user = await usersRepository.create({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      passwordDigest: 'hashed-password',
    })

    const result = await getProfileUseCase.execute({
      userId: user.publicId,
    })

    expect(result.user.id).toBe(user.publicId)
    expect(result.user.name).toBe('Test User')
    expect(result.user.username).toBe('testuser')
    expect(result.user.posts).toBeInstanceOf(Array)
    expect(result.user.reposts).toBeInstanceOf(Array)
  })

  it('should throw ResourceNotFoundError when user does not exist', async () => {
    await expect(
      getProfileUseCase.execute({
        userId: 'non-existent-user',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})