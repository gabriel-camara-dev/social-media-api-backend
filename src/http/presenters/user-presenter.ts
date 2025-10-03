import { User, USER_ROLE } from '@prisma/client'

export interface HTTPUser {
  id: string
  profilePicture?: string | null
  name: string
  username: string
  isPrivate: boolean
  description: string | null
  birthDate: Date | null
  email: string
  role: USER_ROLE
  createdAt: Date
  updatedAt: Date
}

export interface HTTPUserProfileInfo {
  id: string
  profilePicture?: string | null
  name: string
  username: string
  description: string | null
  birthDate: Date | null
  role: USER_ROLE
  isPrivate: boolean
  createdAt: Date
  updatedAt: Date
  postsOrRepostsCount: number
  followersCount: number
  followingCount: number
  posts: {
    id: string
    content: string | null
    likes: number
    createdAt: Date
    updatedAt: Date
  }[]
  reposts: {
    id: string
    content: string | null
    likes: number
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
      isPrivate: input.isPrivate,
      profilePicture: input.profilePicture,
      name: input.name,
      username: input.username,
      description: input.description,
      birthDate: input.birthDate,
      email: input.email,
      role: input.role,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    }
  }
}
