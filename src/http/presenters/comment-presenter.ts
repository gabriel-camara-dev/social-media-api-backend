import { Comment, User } from '@prisma/client'

export interface HTTPComment {
  id: string
  content: string
  likes: number
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    name: string
    username: string
    isPrivate: boolean
  }
  replies?: HTTPComment[]
}

export type CommentWithAuthorAndReplies = Comment & {
  author: User
  replies?: (Comment & { author: User })[]
}

export class CommentPresenter {
  static toHTTP(comment: Comment & { author: User }): HTTPComment
  static toHTTP(comments: (Comment & { author: User })[]): HTTPComment[]
  static toHTTP(
    input: (Comment & { author: User }) | (Comment & { author: User })[]
  ): HTTPComment | HTTPComment[] {
    if (Array.isArray(input)) {
      return input.map((comment) => this.toHTTP(comment))
    }

    return {
      id: input.publicId,
      content: input.content,
      likes: input.likes,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      author: {
        id: input.author.publicId,
        name: input.author.name,
        username: input.author.username,
        isPrivate: input.author.isPrivate,
      },
    }
  }

  static toHTTPWithReplies(comment: CommentWithAuthorAndReplies): HTTPComment {
    const baseComment = this.toHTTP(comment) as HTTPComment

    if (comment.replies && comment.replies.length > 0) {
      baseComment.replies = comment.replies.map(
        (reply) => this.toHTTPWithReplies({ ...reply, replies: [] })
      )
    }

    return baseComment
  }

  static toHTTPWithRepliesArray(
    comments: CommentWithAuthorAndReplies[]
  ): HTTPComment[] {
    return comments.map((comment) => this.toHTTPWithReplies(comment))
  }
}
