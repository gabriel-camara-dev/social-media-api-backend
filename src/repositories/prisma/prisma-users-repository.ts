import { Prisma, User } from '@prisma/client'
import {
  UserProfileInfo,
  UserResponseData,
  UsersRepository,
} from '../users-repository'
import { prisma } from '../../lib/prisma'
import { UsernameAlreadyTakenError } from '../../use-cases/errors/username-already-taken'

export class PrismaUsersRepository implements UsersRepository {
  async findByUsername(username: string) {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    })
    return user
  }

  async getProfileInfo(userId: number): Promise<UserProfileInfo | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        publicId: true,
        profilePicture: true,
        name: true,
        username: true,
        description: true,
        birthDate: true,
        role: true,
        isPrivate: true,
        createdAt: true,
        updatedAt: true,
        followers: { select: { id: true } },
        following: { select: { id: true } },
        posts: {
          include: {
            author: true,
          },
        },
        reposts: {
          include: {
            user: true,
            post: {
              include: { author: true },
            },
            comment: {
              include: { author: true },
            },
          },
        },
      },
    })

    if (!user) return null

    return {
      publicId: user.publicId,
      profilePicture: user.profilePicture,
      name: user.name,
      username: user.username,
      description: user.description,
      birthDate: user.birthDate,
      role: user.role,
      isPrivate: user.isPrivate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      postsOrRepostsCount: user.posts.length + user.reposts.length,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      posts: user.posts,
      reposts: user.reposts,
    }
  }

  async getUserProfileInfo(publicId: string): Promise<UserProfileInfo | null> {
    const user = await prisma.user.findUnique({
      where: { publicId },
      select: {
        publicId: true,
        name: true,
        username: true,
        profilePicture: true,
        description: true,
        birthDate: true,
        role: true,
        isPrivate: true,
        createdAt: true,
        updatedAt: true,
        followers: { select: { id: true } },
        following: { select: { id: true } },
        posts: {
          include: {
            author: true,
          },
        },
        reposts: {
          include: {
            user: true,
            post: {
              include: { author: true },
            },
            comment: {
              include: { author: true },
            },
          },
        },
      },
    })

    if (!user) return null

    return {
      publicId: user.publicId,
      profilePicture: user.profilePicture,
      name: user.name,
      username: user.username,
      description: user.description,
      birthDate: user.birthDate,
      role: user.role,
      isPrivate: user.isPrivate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      postsOrRepostsCount: user.posts.length + user.reposts.length,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      posts: user.posts,
      reposts: user.reposts,
    }
  }

  async listFollowers(publicId: string) {
    const user = await prisma.user.findUnique({
      where: { publicId },
      include: {
        followers: {
          include: { follower: true },
        },
      },
    })

    if (!user) return []

    return user.followers.map((f) => ({
      publicId: f.follower.publicId,
      profilePicture: f.follower.profilePicture,
      name: f.follower.name,
      username: f.follower.username,
      birthDate: f.follower.birthDate ?? undefined,
      description: f.follower.description,
    }))
  }

  async listFollowing(publicId: string) {
    const user = await prisma.user.findUnique({
      where: { publicId },
      include: {
        following: {
          include: { following: true },
        },
      },
    })

    if (!user) return []

    return user.following.map((f) => ({
      publicId: f.following.publicId,
      profilePicture: f.following.profilePicture,
      name: f.following.name,
      username: f.following.username,
      birthDate: f.following.birthDate ?? undefined,
      description: f.following.description,
    }))
  }

  async followOrUnfollowUser(
    followerPublicId: string,
    followingPublicId: string
  ): Promise<void> {
    const follower = await prisma.user.findUnique({
      where: { publicId: followerPublicId },
      select: { publicId: true },
    })
    const following = await prisma.user.findUnique({
      where: { publicId: followingPublicId },
      select: { publicId: true },
    })
    if (!follower || !following) return

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: follower.publicId,
          followingId: following.publicId,
        },
      },
    })

    if (existingFollow) {
      await prisma.follow.delete({ where: { id: existingFollow.id } })
    } else {
      await prisma.follow.create({
        data: {
          followerId: follower.publicId,
          followingId: following.publicId,
        },
      })
    }
  }

  async togglePrivateProfile(publicId: string) {
    const user = await prisma.user.findFirst({ where: { publicId } })

    if (user?.isPrivate == true) {
      await prisma.user.update({
        where: { publicId },
        data: { isPrivate: false },
      })
    } else {
      await prisma.user.update({
        where: { publicId },
        data: { isPrivate: true },
      })
    }
  }

  async canViewProfile(
    profilePublicId: string | undefined,
    viewerPublicId: string | undefined
  ) {
    if (!profilePublicId) return false

    const profileUser = await prisma.user.findUnique({
      where: { publicId: profilePublicId },
      select: { publicId: true, isPrivate: true },
    })

    if (!profileUser) return false

    if (!profileUser.isPrivate) {
      return true
    }

    if (!viewerPublicId) {
      return false
    }

    const viewer = await prisma.user.findUnique({
      where: { publicId: viewerPublicId },
      select: { publicId: true },
    })

    if (!viewer) return false

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: viewer.publicId,
          followingId: profileUser.publicId,
        },
      },
    })

    return !!follow
  }

  async setLastLogin(id: number) {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        lastLogin: new Date(),
      },
    })
  }

  async delete(userId: string) {
    await prisma.user.delete({
      where: {
        publicId: userId,
      },
    })
  }

  async update(publicId: string, data: Prisma.UserUpdateInput) {
    const user = await prisma.user.update({
      where: { publicId },
      data,
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return user
  }
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })
    return user
  }

  async findById(id: number) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    return user
  }

  async findByPublicId(publicId: string) {
    const user = await prisma.user.findUnique({
      where: {
        publicId,
      },
    })
    return user
  }
}