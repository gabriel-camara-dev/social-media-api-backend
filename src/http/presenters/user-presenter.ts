import { User, USER_ROLE } from '@prisma/client'
import { UserProfileInfo } from '../../repositories/users-repository'
import { HTTPPost, PostPresenter } from './post-presenter'
import { HTTPRepost, RepostPresenter } from './repost-presenter'
import { PostsWithAuthor } from '../../repositories/posts-repository'

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
  posts: HTTPPost[]
  reposts: HTTPRepost[]
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

  static toHTTPProfile(profile: UserProfileInfo): HTTPUserProfileInfo {
    return {
      id: profile.publicId,
      profilePicture: profile.profilePicture,
      name: profile.name,
      username: profile.username,
      description: profile.description,
      birthDate: profile.birthDate,
      role: profile.role,
      isPrivate: profile.isPrivate,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      postsOrRepostsCount: profile.postsOrRepostsCount,
      followersCount: profile.followersCount,
      followingCount: profile.followingCount,
      posts: PostPresenter.toHTTP(profile.posts as PostsWithAuthor[]),
      reposts: profile.reposts.map(RepostPresenter.toHTTP),
    }
  }
}
