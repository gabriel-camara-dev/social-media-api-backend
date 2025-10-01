import { Prisma, User } from '@prisma/client'
import { UserProfileInfo, UsersRepository } from '../users-repository'
import { prisma } from '../../lib/prisma'

export class PrismaUsersRepository implements UsersRepository {
  async getProfileInfo(userId: number): Promise<UserProfileInfo | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        publicId: true,
        name: true,
        role: true,
        isPrivate: true,
        createdAt: true,
        updatedAt: true,
        followers: { select: { id: true } },
        following: { select: { id: true } },
        posts: {
          select: {
            publicId: true,
            content: true,
            likes: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        reposts: {
          select: {
            publicId: true,
            createdAt: true,
            post: {
              select: {
                content: true,
                likes: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            comment: {
              select: {
                content: true,
                likes: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    })

    if (!user) return null

    return {
      publicId: user.publicId,
      name: user.name,
      role: user.role,
      isPrivate: user.isPrivate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      postsOrRepostsCount: user.posts.length + user.reposts.length,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      posts: user.posts.map((p) => ({
        id: p.publicId,
        content: p.content,
        likes: p.likes,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      reposts: user.reposts.map((r) => ({
        id: r.publicId,
        content: r.post?.content ?? null,
        likes: r.post?.likes ?? 0,
        createdAt: r.createdAt,
        updatedAt: r.post?.updatedAt ?? r.createdAt,
      })),
    }
  }

  async getUserProfileInfo(publicId: string): Promise<UserProfileInfo | null> {
    const user = await prisma.user.findUnique({
      where: { publicId },
      select: {
        publicId: true,
        name: true,
        role: true,
        isPrivate: true,
        createdAt: true,
        updatedAt: true,
        followers: { select: { id: true } },
        following: { select: { id: true } },
        posts: {
          select: {
            publicId: true,
            content: true,
            likes: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        reposts: {
          select: {
            publicId: true,
            createdAt: true,
            post: {
              select: {
                content: true,
                likes: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            comment: {
              select: {
                content: true,
                likes: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    })

    if (!user) return null

    return {
      publicId: user.publicId,
      name: user.name,
      role: user.role,
      isPrivate: user.isPrivate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      postsOrRepostsCount: user.posts.length + user.reposts.length,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      posts: user.posts.map((p) => ({
        id: p.publicId,
        content: p.content,
        likes: p.likes,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      reposts: user.reposts.map((r) => ({
        id: r.publicId,
        content: r.post?.content ?? null,
        likes: r.post?.likes ?? 0,
        createdAt: r.createdAt,
        updatedAt: r.post?.updatedAt ?? r.createdAt,
      })),
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
      name: f.follower.name,
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
      name: f.following.name,
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

  async canViewProfile(profilePublicId: string | undefined, viewerPublicId: string) {
    if (!profilePublicId) return false
    
    const profileUser = await prisma.user.findUnique({
      where: { publicId: profilePublicId },
      select: { publicId: true, isPrivate: true },
    })

    if (!profileUser) return false

    if (!profileUser.isPrivate) {
      return true
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

  async delete(id: number) {
    await prisma.user.delete({
      where: {
        id,
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
