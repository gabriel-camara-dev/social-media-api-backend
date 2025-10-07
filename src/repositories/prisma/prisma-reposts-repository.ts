import { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { RepostRepository } from '../reposts-repository'
import { RepostWithDetails } from '../../http/presenters/repost-presenter'

export class PrismaRepostRepository implements RepostRepository {
  async delete(id: number) {
    await prisma.repost.delete({
      where: {
        id,
      },
    })
  }

  async create(data: Prisma.RepostUncheckedCreateInput) {
    const repost = await prisma.repost.create({
      data,
    })
    return repost
  }

  async findById(id: number): Promise<RepostWithDetails | null> {
    const repost = await prisma.repost.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        post: {
          include: {
            author: true,
          },
        },
        comment: {
          include: {
            author: true,
          },
        },
      },
    })
    return repost
  }

  async findByPublicId(publicId: string): Promise<RepostWithDetails | null> {
    const repost = await prisma.repost.findUnique({
      where: {
        publicId,
      },
      include: {
        user: true,
        post: {
          include: {
            author: true,
          },
        },
        comment: {
          include: {
            author: true,
          },
        },
      },
    })
    return repost
  }

  async findByUserAndContent(
    userId: string,
    postId?: string,
    commentId?: string
  ) {
    const repost = await prisma.repost.findFirst({
      where: {
        userId,
        postId: postId || null,
        commentId: commentId || null,
      },
    })
    return repost
  }
}