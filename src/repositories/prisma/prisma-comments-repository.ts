// src/repositories/prisma/prisma-comments-repository.ts
import { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { CommentRepository, CommentWithAuthor } from '../comments-repository'

export class PrismaCommentsRepository implements CommentRepository {
  async delete(id: number) {
    await prisma.comment.delete({
      where: {
        id,
      },
    })
  }

  async update(
    id: number,
    data: Prisma.CommentUpdateInput
  ): Promise<CommentWithAuthor> {
    const comment = await prisma.comment.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    })

    return comment
  }

  async create(
    data: Prisma.CommentUncheckedCreateInput
  ): Promise<CommentWithAuthor> {
    const comment = await prisma.comment.create({
      data,
      include: {
        author: true,
      },
    })
    return comment
  }

  async findById(id: number): Promise<CommentWithAuthor | null> {
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

  async findByPublicId(publicId: string): Promise<CommentWithAuthor | null> {
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
}
