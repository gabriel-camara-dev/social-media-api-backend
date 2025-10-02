import { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { PostsRepository, PostsWithAuthor } from '../posts-repository'

export class PrismaPostsRepository implements PostsRepository {
  async create(
    data: Prisma.PostsUncheckedCreateInput
  ): Promise<PostsWithAuthor> {
    const post = await prisma.posts.create({
      data,
      include: {
        author: true, // Inclui o autor
      },
    })

    return post
  }

  async findById(id: number): Promise<PostsWithAuthor | null> {
    const post = await prisma.posts.findUnique({
      where: { id },
      include: {
        author: true,
      },
    })

    return post
  }

  async findByPublicId(publicId: string): Promise<PostsWithAuthor | null> {
    const post = await prisma.posts.findUnique({
      where: { publicId },
      include: {
        author: true,
      },
    })

    return post
  }

  async delete(publicId: string): Promise<void> {
    await prisma.posts.delete({
      where: { publicId },
    })
  }

  async update(
    publicId: string,
    data: Prisma.PostsUpdateInput
  ): Promise<PostsWithAuthor> {
    const post = await prisma.posts.update({
      where: { publicId },
      data,
      include: {
        author: true,
      },
    })

    return post
  }
}
