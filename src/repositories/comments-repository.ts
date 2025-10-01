import { Comment, Prisma } from '@prisma/client'

export interface CommentRepository {
  create: (data: Prisma.CommentCreateInput) => Promise<Comment>
  findById: (id: number) => Promise<Comment | null>
  findByPublicId: (publicId: string) => Promise<Comment | null>
  delete: (id: number) => Promise<void>
  update: (id: number, data: Prisma.CommentUpdateInput) => Promise<Comment>
}
