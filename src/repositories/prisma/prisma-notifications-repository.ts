import { Notification, Prisma } from '@prisma/client'
import {
  NotificationsRepository,
  NotificationWithActors,
} from '../notifications-repository'
import { prisma } from '../../lib/prisma'

export class PrismaNotificationsRepository implements NotificationsRepository {
  async create(
    data: Prisma.NotificationUncheckedCreateInput
  ): Promise<Notification> {
    return prisma.notification.create({ data })
  }

  async addActorToNotification(
    notificationId: number,
    actorId: string
  ): Promise<void> {
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        updatedAt: new Date(),
        actors: {
          create: {
            actorId,
          },
        },
      },
    })
  }

  async findGroupableNotification(
    recipientId: string,
    type: 'LIKE' | 'REPOST',
    postId?: string,
    commentId?: string
  ): Promise<Notification | null> {
    return prisma.notification.findFirst({
      where: {
        recipientId,
        type,
        postId: postId || null,
        commentId: commentId || null,
        read: false,
      },
    })
  }

  async findByRecipient(
    recipientId: string,
    options: { page: number; limit: number }
  ): Promise<NotificationWithActors[]> {
    const { page, limit } = options
    return prisma.notification.findMany({
      where: { recipientId },
      include: {
        actors: {
          include: {
            actor: {
              select: {
                username: true,
                name: true,
                profilePicture: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
      skip: (page - 1) * limit,
    })
  }

  async markAsRead(notificationId: number): Promise<void> {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { recipientId, read: false },
      data: { read: true },
    })
  }
}
