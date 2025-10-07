import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile-use-case'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UserProfileIsPrivateError } from '../errors/user-profile-is-private-error'

describe('GetUserProfileUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let getUserProfileUseCase: GetUserProfileUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)
  })

  it('should get public user profile without userId', async () => {
    const user = await usersRepository.create({
      name: 'Public User',
      username: 'publicuser',
      email: 'public@example.com',
      passwordDigest: 'hashed-password',
      isPrivate: false,
    })

    const result = await getUserProfileUseCase.execute({
      publicId: user.publicId,
    })

    expect(result.user.id).toBe(user.publicId)
    expect(result.user.name).toBe('Public User')
    expect(result.user.username).toBe('publicuser')
  })

  it('should get public user profile with userId', async () => {
    const viewer = await usersRepository.create({
      name: 'Viewer User',
      username: 'viewer',
      email: 'viewer@example.com',
      passwordDigest: 'hashed-password',
    })

    const targetUser = await usersRepository.create({
      name: 'Public User',
      username: 'publicuser',
      email: 'public@example.com',
      passwordDigest: 'hashed-password',
      isPrivate: false,
    })

    const result = await getUserProfileUseCase.execute({
      userId: viewer.publicId,
      publicId: targetUser.publicId,
    })

    expect(result.user.id).toBe(targetUser.publicId)
  })

  it('should get private user profile when user is following', async () => {
    const viewer = await usersRepository.create({
      name: 'Viewer User',
      username: 'viewer',
      email: 'viewer@example.com',
      passwordDigest: 'hashed-password',
    })

    const targetUser = await usersRepository.create({
      name: 'Private User',
      username: 'privateuser',
      email: 'private@example.com',
      passwordDigest: 'hashed-password',
      isPrivate: true,
    })

    await usersRepository.followOrUnfollowUser(
      viewer.publicId,
      targetUser.publicId
    )

    const result = await getUserProfileUseCase.execute({
      userId: viewer.publicId,
      publicId: targetUser.publicId,
    })

    expect(result.user.id).toBe(targetUser.publicId)
  })

  it('should throw UserProfileIsPrivateError when trying to view private profile without following', async () => {
    const viewer = await usersRepository.create({
      name: 'Viewer User',
      username: 'viewer',
      email: 'viewer@example.com',
      passwordDigest: 'hashed-password',
    })

    const targetUser = await usersRepository.create({
      name: 'Private User',
      username: 'privateuser',
      email: 'private@example.com',
      passwordDigest: 'hashed-password',
      isPrivate: true,
    })

    await expect(
      getUserProfileUseCase.execute({
        userId: viewer.publicId,
        publicId: targetUser.publicId,
      })
    ).rejects.toBeInstanceOf(UserProfileIsPrivateError)
  })

  it('should throw ResourceNotFoundError when user does not exist', async () => {
    await expect(
      getUserProfileUseCase.execute({
        publicId: 'non-existent-user',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})