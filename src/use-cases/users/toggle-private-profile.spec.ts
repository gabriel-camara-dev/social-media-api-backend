import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { TogglePrivateProfileUseCase } from './toggle-private-profile-use-case'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

describe('TogglePrivateProfileUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let togglePrivateProfileUseCase: TogglePrivateProfileUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    togglePrivateProfileUseCase = new TogglePrivateProfileUseCase(
      usersRepository
    )
  })

  it('should toggle private profile from false to true', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      passwordDigest: 'hashed-password',
    })

    await togglePrivateProfileUseCase.execute({
      publicId: user.publicId,
    })

    const updatedUser = await usersRepository.findByPublicId(user.publicId)
    expect(updatedUser?.isPrivate).toBe(true)
  })

  it('should toggle private profile from true to false', async () => {
    const user = await usersRepository.create({
      name: 'Jane Doe',
      username: 'janedoe',
      email: 'janedoe@example.com',
      passwordDigest: 'hashed-password',
      isPrivate: true,
    })

    await togglePrivateProfileUseCase.execute({
      publicId: user.publicId,
    })

    const updatedUser = await usersRepository.findByPublicId(user.publicId)
    expect(updatedUser?.isPrivate).toBe(false)
  })

  it('should update updatedAt when toggling profile', async () => {
    const user = await usersRepository.create({
      name: 'John Smith',
      username: 'johnsmith',
      email: 'johnsmith@example.com',
      passwordDigest: 'hashed-password',
    })

    const originalUpdatedAt = user.updatedAt
    await new Promise(resolve => setTimeout(resolve, 15))

    await togglePrivateProfileUseCase.execute({
      publicId: user.publicId,
    })

    const updatedUser = await usersRepository.findByPublicId(user.publicId)
    expect(updatedUser?.updatedAt.getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime()
    )
  })

  it('should throw ResourceNotFoundError when user does not exist', async () => {
    await expect(
      togglePrivateProfileUseCase.execute({
        publicId: 'non-existent-user',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should toggle multiple times correctly', async () => {
    const user = await usersRepository.create({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      passwordDigest: 'hashed-password',
    })

    await togglePrivateProfileUseCase.execute({
      publicId: user.publicId,
    })
    expect(
      (await usersRepository.findByPublicId(user.publicId))?.isPrivate
    ).toBe(true)

    await togglePrivateProfileUseCase.execute({
      publicId: user.publicId,
    })
    expect(
      (await usersRepository.findByPublicId(user.publicId))?.isPrivate
    ).toBe(false)

    await togglePrivateProfileUseCase.execute({
      publicId: user.publicId,
    })
    expect(
      (await usersRepository.findByPublicId(user.publicId))?.isPrivate
    ).toBe(true)
  })
})
