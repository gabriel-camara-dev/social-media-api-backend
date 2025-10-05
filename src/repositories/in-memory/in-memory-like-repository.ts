import { Like } from '@prisma/client'
import { LikeRepository } from '../like-repository'

export class InMemoryLikeRepository implements LikeRepository {
  public items: Like[] = []

  async toggleLikePost(userId: string, postId: string): Promise<void> {
    const existingLikeIndex = this.items.findIndex(
      (item) =>
        item.userId === userId &&
        item.postId === postId &&
        item.commentId === null
    )

    if (existingLikeIndex !== -1) {
      this.items.splice(existingLikeIndex, 1)
    } else {
      const like: Like = {
        id: this.items.length + 1,
        userId,
        postId,
        commentId: null,
        createdAt: new Date(),
      }

      this.items.push(like)
    }
  }

  async toggleLikeComment(userId: string, commentId: string): Promise<void> {
    const existingLikeIndex = this.items.findIndex(
      (item) =>
        item.userId === userId &&
        item.commentId === commentId &&
        item.postId === null
    )

    if (existingLikeIndex !== -1) {
      this.items.splice(existingLikeIndex, 1)
    } else {
      const like: Like = {
        id: this.items.length + 1,
        userId,
        postId: null,
        commentId,
        createdAt: new Date(),
      }

      this.items.push(like)
    }
  }
}
