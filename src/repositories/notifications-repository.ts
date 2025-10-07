import { Notification, NotificationActor, Prisma } from '@prisma/client'

export type NotificationWithActors = Notification & {
  actors: (NotificationActor & {
    actor: { username: string; name: string; profilePicture: string | null }
  })[]
}

export interface NotificationsRepository {
  create(data: Prisma.NotificationUncheckedCreateInput): Promise<Notification>
  addActorToNotification(notificationId: number, actorId: string): Promise<void>
  findGroupableNotification(
    recipientId: string,
    type: 'LIKE' | 'REPOST',
    postId?: string,
    commentId?: string
  ): Promise<Notification | null>
  findByRecipient(
    recipientId: string,
    options: { page: number; limit: number }
  ): Promise<NotificationWithActors[]>
  markAsRead(notificationId: number): Promise<void>
  markAllAsRead(recipientId: string): Promise<void>
}
