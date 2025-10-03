import { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { CommentRepository } from '../comments-repository'

export class PrismaCommentsRepository implements CommentRepository {
  async delete(id: number) {
    await prisma.comment.delete({
      where: {
        id,
      },
    })
  }

  async update(id: number, data: Prisma.CommentUpdateInput) {
    const comment = await prisma.comment.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    })

    return comment
  }

  async create(data: Prisma.CommentUncheckedCreateInput) {
    const comment = await prisma.comment.create({
      data,
      include: {
        author: true,
      },
    })
    return comment
  }

  async findById(id: number) {
    const comment = await prisma.comment.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    })
    return comment
  }

  async findByPublicId(publicId: string) {
    const comment = await prisma.comment.findUnique({
      where: {
        publicId,
      },
      include: {
        author: true,
      },
    })
    return comment
  }

  async findByPostId(postId: string) {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null,
      },
      include: {
        author: true,
        replies: {
          include: {
            author: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return comments
  }
}
