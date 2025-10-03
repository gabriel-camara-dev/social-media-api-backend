import { Posts, User } from '@prisma/client'
import {
  HTTPComment,
  CommentPresenter,
  CommentWithAuthorAndReplies,
} from './comment-presenter'
import { PostWithComments } from '../../repositories/posts-repository'

export interface HTTPPost {
  id: string
  content: string
  likes: number
  image?: string | null
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    profilePicture?: string | null
    name: string
    username: string
    isPrivate: boolean
  }
}

export interface HTTPPostWithComments extends HTTPPost {
  comments: HTTPComment[]
}

export class PostPresenter {
  static toHTTP(post: Posts & { author: User }): HTTPPost
  static toHTTP(posts: (Posts & { author: User })[]): HTTPPost[]
  static toHTTP(
    input: (Posts & { author: User }) | (Posts & { author: User })[]
  ): HTTPPost | HTTPPost[] {
    if (Array.isArray(input)) {
      return input.map((post) => this.toHTTP(post))
    }

    return {
      id: input.publicId,
      content: input.content,
      likes: input.likes,
      image: input.image,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      author: {
        id: input.author.publicId,
        profilePicture: input.author.profilePicture,
        name: input.author.name,
        username: input.author.username,
        isPrivate: input.author.isPrivate,
      },
    }
  }

  static toHTTPWithComments(post: PostWithComments): HTTPPostWithComments {
    const basePost = this.toHTTP(post) as HTTPPost

    return {
      ...basePost,
      comments: CommentPresenter.toHTTPWithRepliesArray(post.comments).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      ),
    }
  }

  static toHTTPWithCommentsArray(
    posts: PostWithComments[]
  ): HTTPPostWithComments[] {
    return posts.map((post) => this.toHTTPWithComments(post))
  }
}
