import { PrismaClient } from '@prisma/client'
import { LikeRepository } from '../like-repository'

const prisma = new PrismaClient()

export class PrismaLikeRepository implements LikeRepository {
  async toggleLikePost(userId: string, postId: string): Promise<boolean> {
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
      return false
    } else {
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      })
      return true
    }
  }

  async toggleLikeComment(userId: string, commentId: string): Promise<boolean> {
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
      return false
    } else {
      await prisma.like.create({
        data: {
          userId,
          commentId,
        },
      })
      return true
    }
  }
}