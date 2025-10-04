import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { ListFollowersUseCase } from './list-followers-use-case'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

describe('ListFollowersUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let listFollowersUseCase: ListFollowersUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    listFollowersUseCase = new ListFollowersUseCase(usersRepository)
  })

  it('should return empty list when user has no followers', async () => {
    const user = await usersRepository.create({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      passwordDigest: 'hashed-password',
    })

    const result = await listFollowersUseCase.execute({
      publicId: user.publicId,
    })

    expect(result.followers).toHaveLength(0)
  })

  it('should return list of followers', async () => {
    const user = await usersRepository.create({
      name: 'Main User',
      username: 'mainuser',
      email: 'main@example.com',
      passwordDigest: 'hashed-password',
    })

    const follower1 = await usersRepository.create({
      name: 'Follower 1',
      username: 'follower1',
      email: 'follower1@example.com',
      passwordDigest: 'hashed-password',
    })

    const follower2 = await usersRepository.create({
      name: 'Follower 2',
      username: 'follower2',
      email: 'follower2@example.com',
      passwordDigest: 'hashed-password',
    })

    await usersRepository.followOrUnfollowUser(
      follower1.publicId,
      user.publicId
    )
    await usersRepository.followOrUnfollowUser(
      follower2.publicId,
      user.publicId
    )

    const result = await listFollowersUseCase.execute({
      publicId: user.publicId,
    })

    expect(result.followers).toHaveLength(2)
  })

  it('should throw ResourceNotFoundError when user does not exist', async () => {
    await expect(
      listFollowersUseCase.execute({
        publicId: 'non-existent-user',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
