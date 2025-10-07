import { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import {
  FeedItem,
  PostsRepository,
  PostsWithAuthor,
  PostWithComments,
} from '../posts-repository'
import { PostNotFoundError } from '../../use-cases/errors/post-not-found-error'

export class PrismaPostsRepository implements PostsRepository {
  async findManyByRelevance(options: {
    page: number
    limit: number
    followedUserIds?: string[]
  }): Promise<FeedItem[]> {
    const { page, limit, followedUserIds } = options
    const offset = (page - 1) * limit
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)

    const whereClause = followedUserIds
      ? Prisma.sql`WHERE p.user_id IN (${Prisma.join(followedUserIds)})`
      : Prisma.sql``

    const feedItems = await prisma.$queryRaw<FeedItem[]>`
      SELECT
        "publicId",
        "type",
        "createdAt",
        "content",
        "image",
        "authorId",
        "authorName",
        "authorUsername",
        "authorProfilePicture",
        (likes * 1.0 + comments * 1.5 + reposts * 2.0) / (EXTRACT(EPOCH FROM (NOW() - "createdAt")) / 3600 + 1) AS score
      FROM (
        SELECT
          p.public_id AS "publicId",
          'post' AS "type",
          p.created_at AS "createdAt",
          p.content,
          p.image,
          p.user_id AS "authorId",
          u.name AS "authorName",
          u.username AS "authorUsername",
          u.profile_picture AS "authorProfilePicture",
          COUNT(DISTINCT l.id) AS likes,
          COUNT(DISTINCT c.id) AS comments,
          COUNT(DISTINCT r.id) AS reposts
        FROM posts p
        JOIN users u ON p.user_id = u.public_id
        LEFT JOIN likes l ON l.post_id = p.public_id
        LEFT JOIN comments c ON c.post_id = p.public_id
        LEFT JOIN reposts r ON r.post_id = p.public_id
        ${whereClause}
        AND p.created_at >= ${twoDaysAgo}
        GROUP BY p.public_id, u.public_id

        UNION ALL

        SELECT
          r.public_id AS "publicId",
          'repost' AS "type",
          r.created_at AS "createdAt",
          orig_p.content,
          orig_p.image,
          r.user_id AS "authorId",
          u.name AS "authorName",
          u.username AS "authorUsername",
          u.profile_picture AS "authorProfilePicture",
          COUNT(DISTINCT l.id) AS likes,
          COUNT(DISTINCT c.id) AS comments,
          COUNT(DISTINCT orig_r.id) AS reposts
        FROM reposts r
        JOIN users u ON r.user_id = u.public_id
        JOIN posts orig_p ON r.post_id = orig_p.public_id
        LEFT JOIN likes l ON l.post_id = orig_p.public_id
        LEFT JOIN comments c ON c.post_id = orig_p.public_id
        LEFT JOIN reposts orig_r ON orig_r.post_id = orig_p.public_id
        ${whereClause}
        AND r.created_at >= ${twoDaysAgo}
        GROUP BY r.public_id, u.public_id, orig_p.content, orig_p.image
      ) AS feed_base
      ORDER BY score DESC
      LIMIT ${limit}
      OFFSET ${offset};
    `
    return feedItems
  }

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
