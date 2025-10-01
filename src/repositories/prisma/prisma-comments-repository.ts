import { Prisma, User } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { CommentRepository } from '../comments-repository'

export class PrismaCommentRepository implements CommentRepository {
  async delete(id: number) {
    await prisma.user.delete({
      where: {
        id,
      },
    })
  }

  async update(id: number, data: Prisma.CommentUpdateInput) {
    const comment = await prisma.comment.update({
      where: { id },
      data,
    })

    return comment
  }

  async create(data: Prisma.CommentCreateInput) {
    const comment = await prisma.comment.create({
      data,
    })
    return comment
  }

  async findById(id: number) {
    const comment = await prisma.comment.findUnique({
      where: {
        id,
      },
    })
    return comment
  }

  async findByPublicId(publicId: string) {
    const comment = await prisma.comment.findUnique({
      where: {
        publicId,
      },
    })
    return comment
  }
}
