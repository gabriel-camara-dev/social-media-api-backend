import { NotificationsRepository } from '../../repositories/notifications-repository'

interface CreateNotificationRequest {
  recipientId: string
  actorId: string
  type: 'LIKE' | 'COMMENT' | 'REPLY' | 'FOLLOW' | 'REPOST'
  postId?: string
  commentId?: string
}

export class NotificationService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository
  ) {}

  async create(data: CreateNotificationRequest) {
    const { recipientId, actorId, type, postId, commentId } = data

    if (recipientId === actorId) {
      return
    }

    if (type === 'LIKE' || type === 'REPOST') {
      const existingNotification =
        await this.notificationsRepository.findGroupableNotification(
          recipientId,
          type,
          postId,
          commentId
        )

      if (existingNotification) {
        await this.notificationsRepository.addActorToNotification(
          existingNotification.id,
          actorId
        )
        return
      }
    }

    const notification = await this.notificationsRepository.create({
      type,
      recipientId,
      postId,
      commentId,
    })

    await this.notificationsRepository.addActorToNotification(
      notification.id,
      actorId
    )
  }
}
