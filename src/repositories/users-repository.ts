import { Prisma, User, USER_ROLE } from '@prisma/client'

export interface FollowerOrFollowing {
  publicId: string
  name: string
  username: string
  birthDate?: Date
  description: string | null
}

export interface UserProfileInfo {
  publicId: string
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
export interface UsersRepository {
  create: (data: Prisma.UserCreateInput) => Promise<User>
  findById: (id: number) => Promise<User | null>
  findByPublicId: (publicId: string) => Promise<User | null>
  findByEmail: (email: string) => Promise<User | null>
  setLastLogin: (id: number) => Promise<void>
  delete: (id: number) => Promise<void>
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
  canViewProfile: (publicId: string | undefined, followingId: string) => Promise<boolean>
}
