import { Posts, User } from '@prisma/client'

interface HTTPPost {
  id: string
  content: string
  likes: number
  createdAt: Date
  updatedAt: Date
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
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    }
  }
}
