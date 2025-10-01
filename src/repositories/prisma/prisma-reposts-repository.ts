import { Prisma, User } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { RepostRepository } from '../reposts-repository'

export class PrismaRepostRepository implements RepostRepository {
  async delete(id: number) {
    await prisma.user.delete({
      where: {
        id,
      },
    })
  }

  async update(id: number, data: Prisma.RepostUpdateInput) {
    const repost = await prisma.repost.update({
      where: { id },
      data,
    })

    return repost
  }

  async create(data: Prisma.RepostUncheckedCreateInput) {
    const repost = await prisma.repost.create({
      data,
    })
    return repost
  }

  async findById(id: number) {
    const repost = await prisma.repost.findUnique({
      where: {
        id,
      },
    })
    return repost
  }

  async findByPublicId(publicId: string) {
    const repost = await prisma.repost.findUnique({
      where: {
        publicId,
      },
    })
    return repost
  }
}
