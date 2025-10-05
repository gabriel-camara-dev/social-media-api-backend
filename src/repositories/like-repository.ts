export interface LikeRepository {
  toggleLikePost: (userId: string, postId: string) => Promise<void>
  toggleLikeComment: (userId: string, commentId: string) => Promise<void>
}
