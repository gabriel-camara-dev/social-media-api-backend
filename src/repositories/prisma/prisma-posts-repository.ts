import { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import {
  PostsRepository,
  PostsWithAuthor,
  PostWithComments,
} from '../posts-repository'
import { PostNotFoundError } from '../../use-cases/errors/post-not-found-error'

export class PrismaPostsRepository implements PostsRepository {
  async create(
    data: Prisma.PostsUncheckedCreateInput
  ): Promise<PostsWithAuthor> {
    const post = await prisma.posts.create({
      data,
      include: {
        author: true,
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

  async findByPublicId(
    publicId: string,
    options: { commentsLimit?: number; repliesLimit?: number } = {}
  ): Promise<PostWithComments | null> {
    // ⬅️ ADICIONE ESTE TIPO DE RETORNO
    const commentsLimit = options.commentsLimit || 10
    const repliesLimit = options.repliesLimit || 3

    const post = await prisma.posts.findUnique({
      where: { publicId },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
            replies: {
              include: {
                author: true,
              },
              take: repliesLimit,
              orderBy: { createdAt: 'asc' },
            },
          },
          where: { parentId: null },
          take: commentsLimit,
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: {
            comments: {
              where: { parentId: null },
            },
          },
        },
      },
    })

    if (!post) {
      throw new PostNotFoundError()
    }

    const totalComments = post._count.comments
    const totalPages = Math.ceil(totalComments / commentsLimit)

    return {
      ...post,
      totalPages,
    } as PostWithComments
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
