import { Repost, Prisma } from '@prisma/client'

export interface RepostRepository {
  create: (data: Prisma.RepostUncheckedCreateInput) => Promise<Repost>
  findById: (id: number) => Promise<Repost | null>
  findByPublicId: (publicId: string) => Promise<Repost | null>
  delete: (id: number) => Promise<void>
  update: (id: number, data: Prisma.RepostUpdateInput) => Promise<Repost>
}
