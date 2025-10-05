import { PrismaClient } from '@prisma/client'
import { LikeRepository } from '../like-repository'

const prisma = new PrismaClient()

export class PrismaLikeRepository implements LikeRepository {
  async toggleLikePost(userId: string, postId: string): Promise<void> {
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        postId,
        commentId: null,
      },
    })

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })
    } else {
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      })
    }
  }

  async toggleLikeComment(userId: string, commentId: string): Promise<void> {
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        commentId,
        postId: null,
      },
    })

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })
    } else {
      await prisma.like.create({
        data: {
          userId,
          commentId,
        },
      })
    }
  }
}
