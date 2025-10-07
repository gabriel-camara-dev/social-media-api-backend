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

export interface UserProfileInfo
  extends Omit<HTTPUserProfileInfo, 'id' | 'posts' | 'reposts'> {
  publicId: string
  posts: PostsWithAuthor[]
  reposts: RepostWithDetails[]
}
export interface UsersRepository {
  create: (data: Prisma.UserCreateInput) => Promise<User>
  findById: (id: number) => Promise<User | null>
  findByPublicId: (publicId: string) => Promise<User | null>
  findByEmail: (email: string) => Promise<User | null>
  findByUsername: (username: string) => Promise<User | null>
  setLastLogin: (id: number) => Promise<void>
  delete: (userId: string) => Promise<void>
  update: (publicId: string, data: Prisma.UserUpdateInput) => Promise<User>
  getUserProfileInfo: (publicId: string) => Promise<UserProfileInfo | null>
  getProfileInfo: (userId: number) => Promise<UserProfileInfo | null>

  listFollowers: (publicId: string) => Promise<FollowerOrFollowing[]>
  listFollowing: (publicId: string) => Promise<FollowerOrFollowing[]>
  followOrUnfollowUser: (
    followerId: string,
    followingId: string
  ) => Promise<void>

  togglePrivateProfile: (publicId: string) => Promise<void>
  canViewProfile: (
    publicId: string | undefined,
    followingId: string
  ) => Promise<boolean>
}