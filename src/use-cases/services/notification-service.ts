import { PostsRepository } from '../../repositories/posts-repository'
import { CommentRepository } from '../../repositories/comments-repository'
import { pushNotification } from '../../ws/notifications-ws'

type NotificationType = 'LIKE' | 'COMMENT' | 'REPLY' | 'REPOST' | 'FOLLOW'

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

    pushNotification(recipientId, { type, postId, commentId, actorId })
  }

  async createFollowNotification(recipientId: string, actorId: string) {
    if (!recipientId || recipientId === actorId) return
    pushNotification(recipientId, { type: 'FOLLOW', actorId })
  }
}
