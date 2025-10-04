import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { FollowOrUnfollowUseCase } from './follow-or-unfollow-use-case'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { CantFollowYourselfError } from '../errors/cant-follow-yourself-error'

describe('FollowOrUnfollowUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let followOrUnfollowUseCase: FollowOrUnfollowUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    followOrUnfollowUseCase = new FollowOrUnfollowUseCase(usersRepository)
  })

  it('should follow user successfully', async () => {
    const follower = await usersRepository.create({
      name: 'Follower User',
      username: 'follower',
      email: 'follower@example.com',
      passwordDigest: 'hashed-password',
    })

    const following = await usersRepository.create({
      name: 'Following User',
      username: 'following',
      email: 'following@example.com',
      passwordDigest: 'hashed-password',
    })

    await followOrUnfollowUseCase.execute({
      followerId: follower.publicId,
      followingId: following.publicId,
    })

    const followers = await usersRepository.listFollowers(following.publicId)
    const followingList = await usersRepository.listFollowing(follower.publicId)

    expect(followers).toHaveLength(1)
    expect(followers[0].publicId).toBe(follower.publicId)
    expect(followingList).toHaveLength(1)
    expect(followingList[0].publicId).toBe(following.publicId)
  })

  it('should unfollow user successfully', async () => {
    const follower = await usersRepository.create({
      name: 'Follower User',
      username: 'follower',
      email: 'follower@example.com',
      passwordDigest: 'hashed-password',
    })

    const following = await usersRepository.create({
      name: 'Following User',
      username: 'following',
      email: 'following@example.com',
      passwordDigest: 'hashed-password',
    })

    await followOrUnfollowUseCase.execute({
      followerId: follower.publicId,
      followingId: following.publicId,
    })

    await followOrUnfollowUseCase.execute({
      followerId: follower.publicId,
      followingId: following.publicId,
    })

    const followers = await usersRepository.listFollowers(following.publicId)
    const followingList = await usersRepository.listFollowing(follower.publicId)

    expect(followers).toHaveLength(0)
    expect(followingList).toHaveLength(0)
  })

  it('should throw CantFollowYourselfError when trying to follow yourself', async () => {
    const user = await usersRepository.create({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      passwordDigest: 'hashed-password',
    })

    await expect(
      followOrUnfollowUseCase.execute({
        followerId: user.publicId,
        followingId: user.publicId,
      })
    ).rejects.toBeInstanceOf(CantFollowYourselfError)
  })

  it('should throw ResourceNotFoundError when one of the users does not exist', async () => {
    const existingUser = await usersRepository.create({
      name: 'Existing User',
      username: 'existing',
      email: 'existing@example.com',
      passwordDigest: 'hashed-password',
    })

    await expect(
      followOrUnfollowUseCase.execute({
        followerId: existingUser.publicId,
        followingId: 'non-existent-user',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

    await expect(
      followOrUnfollowUseCase.execute({
        followerId: 'non-existent-user',
        followingId: existingUser.publicId,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should allow multiple users to follow the same user', async () => {
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

    const following = await usersRepository.create({
      name: 'Following User',
      username: 'following',
      email: 'following@example.com',
      passwordDigest: 'hashed-password',
    })

    await followOrUnfollowUseCase.execute({
      followerId: follower1.publicId,
      followingId: following.publicId,
    })

    await followOrUnfollowUseCase.execute({
      followerId: follower2.publicId,
      followingId: following.publicId,
    })

    const followers = await usersRepository.listFollowers(following.publicId)

    expect(followers).toHaveLength(2)
    expect(followers.map((f) => f.publicId)).toContain(follower1.publicId)
    expect(followers.map((f) => f.publicId)).toContain(follower2.publicId)
  })
})
