import { Prisma, User } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { PostsRepository } from '../posts-repository'

export class PrismaPostsRepository implements PostsRepository {
  async delete(id: number) {
    await prisma.user.delete({
      where: {
        id,
      },
    })
  }

  async update(id: number, data: Prisma.PostsUpdateInput) {
    const posts = await prisma.posts.update({
      where: { id },
      data,
    })

    return posts
  }

  async create(data: Prisma.PostsCreateInput) {
    const posts = await prisma.posts.create({
      data,
    })
    return posts
  }

  async findById(id: number) {
    const posts = await prisma.posts.findUnique({
      where: {
        id,
      },
    })
    return posts
  }

  async findByPublicId(publicId: string) {
    const posts = await prisma.posts.findUnique({
      where: {
        publicId,
      },
    })
    return posts
  }
}
