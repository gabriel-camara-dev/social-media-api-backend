import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UserProfileIsPrivateError } from '../errors/user-profile-is-private-error'
import { GetUserProfileSummaryUseCase } from './get-user-profile-summary-use-case'

describe('GetUserProfileSummaryUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let useCase: GetUserProfileSummaryUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    useCase = new GetUserProfileSummaryUseCase(usersRepository)
  })

  it('should get public user profile summary', async () => {
    const user = await usersRepository.create({
      name: 'Public User',
      username: 'publicuser',
      email: 'public@example.com',
      passwordDigest: 'hashed-password',
      isPrivate: false,
    })

    const result = await useCase.execute({
      publicId: user.publicId,
    })

    expect(result.user.publicId).toBe(user.publicId)
    expect(result.user.name).toBe('Public User')
    expect(result.user).not.toHaveProperty('posts')
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
      useCase.execute({
        publicId: targetUser.publicId,
        viewerId: viewer.publicId,
      })
    ).rejects.toBeInstanceOf(UserProfileIsPrivateError)
  })

  it('should get private user profile summary when user is following', async () => {
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

    const result = await useCase.execute({
      publicId: targetUser.publicId,
      viewerId: viewer.publicId,
    })

    expect(result.user.publicId).toBe(targetUser.publicId)
  })

  it('should get own private profile summary', async () => {
    const user = await usersRepository.create({
      name: 'Private User',
      username: 'privateuser',
      email: 'private@example.com',
      passwordDigest: 'hashed-password',
      isPrivate: true,
    })

    const result = await useCase.execute({
      publicId: user.publicId,
      viewerId: user.publicId,
    })

    expect(result.user.publicId).toBe(user.publicId)
  })

  it('should throw ResourceNotFoundError when user does not exist', async () => {
    await expect(
      useCase.execute({
        publicId: 'non-existent-user',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})