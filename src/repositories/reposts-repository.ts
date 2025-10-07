import { Repost, Prisma } from '@prisma/client'
import { RepostWithDetails } from '../http/presenters/repost-presenter'

export interface RepostRepository {
  create: (data: Prisma.RepostUncheckedCreateInput) => Promise<Repost>
  delete: (id: number) => Promise<void>
  findById: (id: number) => Promise<RepostWithDetails | null>
  findByPublicId: (publicId: string) => Promise<RepostWithDetails | null>
  findByUserAndContent: (
    userId: string,
    postId?: string,
    commentId?: string
  ) => Promise<Repost | null>
}