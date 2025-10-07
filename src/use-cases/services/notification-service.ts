import { NotificationsRepository } from '../../repositories/notifications-repository'
import { PostsRepository } from '../../repositories/posts-repository'
import { CommentRepository } from '../../repositories/comments-repository'

interface CreateContentNotificationRequest {
  actorId: string
  type: 'LIKE' | 'COMMENT' | 'REPLY' | 'REPOST'
  postId?: string
  commentId?: string
}

export class NotificationService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentRepository
  ) {}

  async create(data: CreateContentNotificationRequest) {
    const { actorId, type, postId, commentId } = data
    let recipientId: string | undefined

    if (postId) {
      const post = await this.postsRepository.findByPublicId(postId)
      recipientId = post?.author.publicId
    } else if (commentId) {
      const comment = await this.commentsRepository.findByPublicId(commentId)
      recipientId = comment?.author.publicId
    }

    if (!recipientId || recipientId === actorId) {
      return
    }

    const isGroupable = type === 'LIKE' || type === 'REPOST'

    if (isGroupable) {
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

  async createFollowNotification(recipientId: string, actorId: string) {
    if (recipientId === actorId) {
      return
    }

    const existingNotification =
      await this.notificationsRepository.findGroupableNotification(
        recipientId,
        'FOLLOW'
      )

    if (existingNotification) {
      await this.notificationsRepository.addActorToNotification(
        existingNotification.id,
        actorId
      )
      return
    }

    const notification = await this.notificationsRepository.create({
      type: 'FOLLOW',
      recipientId,
    })

    await this.notificationsRepository.addActorToNotification(
      notification.id,
      actorId
    )
  }
}
