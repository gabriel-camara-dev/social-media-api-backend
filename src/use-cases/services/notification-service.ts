import { PostsRepository } from '../../repositories/posts-repository'
import { CommentRepository } from '../../repositories/comments-repository'
import { pushNotification } from '../../ws/web-socket'

type NotificationType = 'LIKE' | 'COMMENT' | 'REPLY' | 'REPOST' | 'FOLLOW'

type NotificationPayload =
  | {
      type: Exclude<NotificationType, 'FOLLOW'>
      postId?: string
      commentId?: string
      actorId: string
    }
  | { type: 'FOLLOW'; actorId: string }

interface CreateContentNotificationRequest {
  actorId: string
  type: Exclude<NotificationType, 'FOLLOW'>
  postId?: string
  commentId?: string
}

export class NotificationService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentRepository
  ) {}

  async create({
    actorId,
    type,
    postId,
    commentId,
  }: CreateContentNotificationRequest) {
    let recipientId: string | undefined

    if (postId) {
      const post = await this.postsRepository.findByPublicId(postId)
      recipientId = post?.author.publicId
    } else if (commentId) {
      const comment = await this.commentsRepository.findByPublicId(commentId)
      recipientId = comment?.author.publicId
    }
    if (!recipientId || recipientId === actorId) return

    const payload: NotificationPayload = { type, postId, commentId, actorId }
    pushNotification(recipientId, payload)
  }

  async createFollowNotification(recipientId: string, actorId: string) {
    if (!recipientId || recipientId === actorId) return
    const payload: NotificationPayload = { type: 'FOLLOW', actorId }
    pushNotification(recipientId, payload)
  }
}
