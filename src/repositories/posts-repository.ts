import { Posts, Prisma } from '@prisma/client'

export interface PostsRepository {
  create: (data: Prisma.PostsCreateInput) => Promise<Posts>
  findById: (id: number) => Promise<Posts | null>
  findByPublicId: (publicId: string) => Promise<Posts | null>
  delete: (id: number) => Promise<void>
  update: (id: number, data: Prisma.PostsUpdateInput) => Promise<Posts>
}
