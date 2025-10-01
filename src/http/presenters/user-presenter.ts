import { Posts, User, USER_ROLE } from '@prisma/client'

interface HTTPUser {
  id: string
  name: string
  email: string
  role: USER_ROLE
  createdAt: Date
  updatedAt: Date
}

interface HTTPUserProfile {
  publicId: string
  name: string
  role: USER_ROLE
  isPrivate: boolean
  createdAt: Date
  updatedAt: Date
  postsOrRepostsCount: number
  followersCount: number
  followingCount: number
  posts: {
    publicId: string
    content: string | null
    likes: number
    createdAt: Date
    updatedAt: Date
  }[]
  reposts: {
    publicId: string
    posts: Posts | null
    createdAt: Date
    updatedAt: Date
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