import { Prisma, User } from '@prisma/client'
import {
  FollowerOrFollowing,
  UserProfileInfo,
  UsersRepository,
} from '../users-repository'

class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []
  public follows: { followerId: string; followingId: string }[] = []

  async findByUsername (username: string) {
    return this.items.find((item) => item.username === username) || null
  }

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: this.items.length + 1,
      publicId: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      username: data.username,
      loginAttempts: 0,
      email: data.email,
      passwordDigest: data.passwordDigest,
      profilePicture: data.profilePicture || null,
      description: data.description || null,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      role: data.role || 'NORMAL_USER',
      isPrivate: data.isPrivate || false,
      lastLogin: data.lastLogin ? new Date(data.lastLogin) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(user)
    return user
  }

  async findById(id: number) {
    return this.items.find((item) => item.id === id) || null
  }

  async findByPublicId(publicId: string) {
    return this.items.find((item) => item.publicId === publicId) || null
  }

  async findByEmail(email: string) {
    return this.items.find((item) => item.email === email) || null
  }

  async setLastLogin(id: number) {
    const user = this.items.find((item) => item.id === id)
    if (user) {
      user.lastLogin = new Date()
    }
  }

  async delete(publicId: string) {
    const index = this.items.findIndex((item) => item.publicId === publicId)
    if (index !== -1) {
      this.items.splice(index, 1)
    }
  }

  async update(publicId: string, data: Prisma.UserUpdateInput) {
    const userIndex = this.items.findIndex((item) => item.publicId === publicId)
    if (userIndex === -1) throw new Error('User not found')

    const user = this.items[userIndex]

    if (data.name) user.name = data.name as string
    if (data.username) user.username = data.username as string
    if (data.email) user.email = data.email as string
    if (data.profilePicture !== undefined)
      user.profilePicture = data.profilePicture as string | null
    if (data.description !== undefined)
      user.description = data.description as string | null
    if (data.birthDate !== undefined)
      user.birthDate = data.birthDate
        ? new Date(data.birthDate as string)
        : null
    if (data.isPrivate !== undefined) user.isPrivate = data.isPrivate as boolean
    if (data.passwordDigest) user.passwordDigest = data.passwordDigest as string

    user.updatedAt = new Date()
    return user
  }

  async getUserProfileInfo(publicId: string): Promise<UserProfileInfo | null> {
    const user = this.items.find((item) => item.publicId === publicId)
    if (!user) return null

    const followers = this.follows.filter((f) => f.followingId === publicId)
    const following = this.follows.filter((f) => f.followerId === publicId)

    return {
      publicId: user.publicId,
      profilePicture: user.profilePicture,
      name: user.name,
      username: user.username,
      description: user.description,
      birthDate: user.birthDate || null,
      role: user.role,
      isPrivate: user.isPrivate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      postsOrRepostsCount: 0,
      followersCount: followers.length,
      followingCount: following.length,
      posts: [],
      reposts: [],
    }
  }

  async getProfileInfo(userId: number): Promise<UserProfileInfo | null> {
    const user = this.items.find((item) => item.id === userId)
    if (!user) return null

    return this.getUserProfileInfo(user.publicId)
  }

  async listFollowers(publicId: string): Promise<FollowerOrFollowing[]> {
    const followers = this.follows.filter((f) => f.followingId === publicId)

    return followers
      .map((follow) => {
        const user = this.items.find(
          (item) => item.publicId === follow.followerId
        )
        if (!user) return null

        return {
          publicId: user.publicId,
          name: user.name,
          username: user.username,
          birthDate: user.birthDate || undefined,
          description: user.description,
          profilePicture: user.profilePicture,
        }
      })
      .filter(Boolean) as FollowerOrFollowing[]
  }

  async listFollowing(publicId: string): Promise<FollowerOrFollowing[]> {
    const following = this.follows.filter((f) => f.followerId === publicId)

    return following
      .map((follow) => {
        const user = this.items.find(
          (item) => item.publicId === follow.followingId
        )
        if (!user) return null

        return {
          publicId: user.publicId,
          name: user.name,
          username: user.username,
          birthDate: user.birthDate || undefined,
          description: user.description,
          profilePicture: user.profilePicture,
        }
      })
      .filter(Boolean) as FollowerOrFollowing[]
  }

  async followOrUnfollowUser(followerId: string, followingId: string) {
    const existingIndex = this.follows.findIndex(
      (f) => f.followerId === followerId && f.followingId === followingId
    )

    if (existingIndex !== -1) {
      this.follows.splice(existingIndex, 1)
    } else {
      this.follows.push({ followerId, followingId })
    }
  }

  async togglePrivateProfile(publicId: string) {
    const user = this.items.find((item) => item.publicId === publicId)
    if (user) {
      user.isPrivate = !user.isPrivate
      user.updatedAt = new Date()
    }
  }

  async canViewProfile(
    viewerPublicId: string | undefined,
    profilePublicId: string
  ) {
    if (!viewerPublicId) return false

    const profileUser = this.items.find(
      (item) => item.publicId === profilePublicId
    )
    if (!profileUser) return false

    if (!profileUser.isPrivate) return true

    if (viewerPublicId === profilePublicId) return true

    const isFollowing = this.follows.some(
      (f) =>
        f.followerId === viewerPublicId && f.followingId === profilePublicId
    )

    return isFollowing
  }
}

export { InMemoryUsersRepository }
