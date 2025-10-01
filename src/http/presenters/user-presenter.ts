import { Comment, Posts, Repost, User, USER_ROLE } from '@prisma/client'

interface HTTPUser {
  id: string
  name: string
  email: string
  role: USER_ROLE
  createdAt: Date
  updatedAt: Date
}

interface HTTPUserProfile {
  id: string
  name: string
  email: string
  role: USER_ROLE
  createdAt: Date
  updatedAt: Date
  posts: {
    id: string
    title: string
    content: string
    likes: number
    createdAt: Date
    updatedAt: Date
  }[]
  comments: {
    id: string
    content: string
    likes: number
    createdAt: Date
    updatedAt: Date
  }[]
  reposts: {
    id: string
    postId?: string
    commentId?: string
    createdAt: Date
  }[]
}

export class UserPresenter {
  static toHTTP(user: User): HTTPUser
  static toHTTP(users: User[]): HTTPUser[]
  static toHTTP(input: User | User[]): HTTPUser | HTTPUser[] {
    if (Array.isArray(input)) {
      return input.map((user) => this.toHTTP(user))
    }

    return {
      id: input.publicId,
      name: input.name,
      email: input.email,
      role: input.role,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    }
  }
}

export class UserProfilePresenter {
  static toHTTP(
    user: User & { posts: Posts[]; comments: Comment[]; reposts: Repost[] }
  ): HTTPUserProfile {
    return {
      id: user.publicId,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      posts: user.posts.map((post) => ({
        id: post.publicId,
        title: post.title,
        content: post.content,
        likes: post.likes,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })),
      comments: user.comments.map((comment) => ({
        id: comment.publicId,
        likes: comment.likes,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      })),
      reposts: user.reposts.map((repost) => ({
        id: repost.publicId,
        postId: repost.postId ? repost.postId.toString() : undefined,
        commentId: repost.commentId ? repost.commentId.toString() : undefined,
        createdAt: repost.createdAt,
      })),
    }
  }

  static toHTTPList(
    users: (User & { posts: Posts[]; comments: Comment[]; reposts: Repost[] })[]
  ): HTTPUserProfile[] {
    return users.map((user) => this.toHTTP(user))
  }
}
