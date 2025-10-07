import { Prisma, Repost, User } from '@prisma/client'
import { RepostRepository } from '../reposts-repository'
import { RepostWithDetails } from '../../http/presenters/repost-presenter'

export class InMemoryRepostsRepository implements RepostRepository {
  public items: Repost[] = []

  async create(data: Prisma.RepostUncheckedCreateInput): Promise<Repost> {
    const repost: Repost = {
      id: this.items.length + 1,
      publicId: `repost-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      userId: data.userId,
      postId: data.postId || null,
      commentId: data.commentId || null,
    }

    this.items.push(repost)
    return repost
  }

  async delete(id: number): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.items.splice(index, 1)
    }
  }

  async findById(id: number): Promise<RepostWithDetails | null> {
    const repost = this.items.find((item) => item.id === id)
    if (!repost) return null
    return this.mockRepostDetails(repost)
  }

  async findByPublicId(publicId: string): Promise<RepostWithDetails | null> {
    const repost = this.items.find((item) => item.publicId === publicId)
    if (!repost) return null
    return this.mockRepostDetails(repost)
  }

  async findByUserAndContent(
    userId: string,
    postId?: string,
    commentId?: string
  ): Promise<Repost | null> {
    const repost = this.items.find(
      (item) =>
        item.userId === userId &&
        item.postId === (postId || null) &&
        item.commentId === (commentId || null)
    )
    return repost || null
  }

  private mockRepostDetails(repost: Repost): RepostWithDetails {
    const mockUser = {
      id: 1,
      publicId: repost.userId,
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      passwordDigest: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPrivate: false,
      birthDate: null,
      description: null,
      profilePicture: null,
      loginAttempts: 0,
      lastLogin: null,
      role: 'NORMAL_USER' as const,
    }

    return {
      ...repost,
      user: mockUser,
      post: repost.postId
        ? {
            id: 1,
            publicId: repost.postId,
            content: 'Mocked Post Content',
            likes: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: 'another-user',
            image: null,
            author: mockUser,
          }
        : null,
      comment: repost.commentId
        ? {
            id: 1,
            publicId: repost.commentId,
            content: 'Mocked Comment Content',
            likes: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            authorId: 'another-user',
            postId: 'mock-post-id',
            parentId: null,
            image: null,
            author: mockUser,
          }
        : null,
    }
  }
}
