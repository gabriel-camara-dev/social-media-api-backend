import { Posts, Prisma, User } from '@prisma/client'
import { CommentWithAuthorAndReplies } from '../http/presenters/comment-presenter'
import { RepostWithDetails } from '../http/presenters/repost-presenter'

export type PostsWithAuthor = Posts & { author: User }

export type PostWithComments = Posts & {
  author: User
  comments: CommentWithAuthorAndReplies[]
  totalPages: number
}

export interface FeedItem {
  publicId: string
  type: 'post' | 'repost'
  score: number
  createdAt: Date
  content: string | null
  image: string | null
  authorId: string
  authorName: string
  authorUsername: string
  authorProfilePicture: string | null
}

export interface PostsRepository {
  create: (data: Prisma.PostsUncheckedCreateInput) => Promise<PostsWithAuthor>
  findById: (id: number) => Promise<PostsWithAuthor | null>
  findByPublicId: (
    publicId: string,
    options?: {
      commentsLimit?: number
      repliesLimit?: number
    }
  ) => Promise<PostWithComments | null>
  delete: (publicId: string) => Promise<void>
  update: (
    publicId: string,
    data: Prisma.PostsUpdateInput
  ) => Promise<PostsWithAuthor>
  findManyByRelevance(options: {
    page: number
    limit: number
    followedUserIds?: string[]
  }): Promise<FeedItem[]>
}
