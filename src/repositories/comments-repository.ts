import { Comment, Prisma, User } from '@prisma/client'

export interface CommentWithAuthor extends Comment {
  author: User
}

export interface CommentRepository {
  create: (
    data: Prisma.CommentUncheckedCreateInput
  ) => Promise<CommentWithAuthor>
  findById: (id: number) => Promise<CommentWithAuthor | null>
  findByPublicId: (publicId: string) => Promise<CommentWithAuthor | null>
  delete: (id: number) => Promise<void>
  update: (
    id: number,
    data: Prisma.CommentUpdateInput
  ) => Promise<CommentWithAuthor>
}
