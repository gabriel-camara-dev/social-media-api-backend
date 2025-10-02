import { Posts, Prisma, User } from '@prisma/client'

export type PostsWithAuthor = Posts & { author: User }

export interface PostsRepository {
  create: (data: Prisma.PostsUncheckedCreateInput) => Promise<PostsWithAuthor>
  findById: (id: number) => Promise<PostsWithAuthor | null>
  findByPublicId: (publicId: string) => Promise<PostsWithAuthor | null>
  delete: (publicId: string) => Promise<void>
  update: (
    publicId: string,
    data: Prisma.PostsUpdateInput
  ) => Promise<PostsWithAuthor>
}
