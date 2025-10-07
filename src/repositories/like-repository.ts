export interface LikeRepository {
  toggleLikePost: (userId: string, postId: string) => Promise<boolean>
  toggleLikeComment: (userId: string, commentId: string) => Promise<boolean>
}