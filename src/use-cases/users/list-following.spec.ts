import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { ListFollowingUseCase } from './list-following-use-case'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

describe('ListFollowingUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let listFollowingUseCase: ListFollowingUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    listFollowingUseCase = new ListFollowingUseCase(usersRepository)
  })

  it('should return empty list when user is not following anyone', async () => {
    const user = await usersRepository.create({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      passwordDigest: 'hashed-password',
    })

    const result = await listFollowingUseCase.execute({
      publicId: user.publicId,
    })

    expect(result.following).toHaveLength(0)
  })

  it('should return list of users being followed', async () => {
    const user = await usersRepository.create({
      name: 'Main User',
      username: 'mainuser',
      email: 'main@example.com',
      passwordDigest: 'hashed-password',
    })

    const following1 = await usersRepository.create({
      name: 'Following 1',
      username: 'following1',
      email: 'following1@example.com',
      passwordDigest: 'hashed-password',
    })

    const following2 = await usersRepository.create({
      name: 'Following 2',
      username: 'following2',
      email: 'following2@example.com',
      passwordDigest: 'hashed-password',
    })

    await usersRepository.followOrUnfollowUser(
      user.publicId,
      following1.publicId
    )
    await usersRepository.followOrUnfollowUser(
      user.publicId,
      following2.publicId
    )

    const result = await listFollowingUseCase.execute({
      publicId: user.publicId,
    })

    expect(result.following).toHaveLength(2)
  })

  it('should throw ResourceNotFoundError when user does not exist', async () => {
    await expect(
      listFollowingUseCase.execute({
        publicId: 'non-existent-user',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
