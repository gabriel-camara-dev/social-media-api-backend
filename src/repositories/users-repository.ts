import { Prisma, User } from '@prisma/client'
import {
  HTTPUser,
  HTTPUserProfileInfo,
} from '../http/presenters/user-presenter'
import { RepostWithDetails } from '../http/presenters/repost-presenter'
import { PostsWithAuthor } from './posts-repository'

export interface FollowerOrFollowing {
  publicId: string
  name: string
  username: string
  birthDate?: Date
  description: string | null
  profilePicture: string | null
}

export type UserResponseData = Omit<HTTPUser, 'id'> & {
  publicId: string
}

export interface UserProfileSummary
  extends Omit<
    HTTPUserProfileInfo,
    'id' | 'posts' | 'reposts' | 'postsOrRepostsCount'
  > {
  publicId: string
  postsCount: number
  repostsCount: number
}

export type UserContent = (PostsWithAuthor | RepostWithDetails)[]

export interface UsersRepository {
  create: (data: Prisma.UserCreateInput) => Promise<User>
  findById: (id: number) => Promise<User | null>
  findByPublicId: (publicId: string) => Promise<User | null>
  findByEmail: (email: string) => Promise<User | null>
  findByUsername: (username: string) => Promise<User | null>
  setLastLogin: (id: number) => Promise<void>
  delete: (userId: string) => Promise<void>
  update: (publicId: string, data: Prisma.UserUpdateInput) => Promise<User>

  findProfileSummaryByPublicId: (
    publicId: string
  ) => Promise<UserProfileSummary | null>
  findUserContentByPublicId: (
    publicId: string,
    options: { page: number; limit: number }
  ) => Promise<UserContent>

  listFollowers: (publicId: string) => Promise<FollowerOrFollowing[]>
  listFollowing: (publicId: string) => Promise<FollowerOrFollowing[]>
  followOrUnfollowUser: (
    followerId: string,
    followingId: string
  ) => Promise<void>

  togglePrivateProfile: (publicId: string) => Promise<void>
  canViewProfile: (
    profilePublicId: string | undefined,
    viewerPublicId: string | undefined
  ) => Promise<boolean>
}