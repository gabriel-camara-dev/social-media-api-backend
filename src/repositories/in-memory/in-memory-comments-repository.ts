import { Prisma, Comment, User } from '@prisma/client'
import { CommentRepository, CommentWithAuthor } from '../comments-repository'

export class InMemoryCommentsRepository implements CommentRepository {
  public items: Comment[] = []

  async create(
    data: Prisma.CommentUncheckedCreateInput
  ): Promise<CommentWithAuthor> {
    const comment: Comment = {
      id: this.items.length + 1,
      publicId: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: data.content,
      image: data.image || null,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: data.authorId,
      postId: data.postId,
      parentId: data.parentId || null,
    }

    this.items.push(comment)

    const commentWithAuthor: CommentWithAuthor = {
      ...comment,
      author: {
        id: 1,
        publicId: data.authorId,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        birthDate: null,
        description: null,
        profilePicture: null,
        loginAttempts: 0,
        lastLogin: null,
        passwordDigest: 'hashed-password',
        role: 'NORMAL_USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPrivate: false,
      } as User,
    }

    return commentWithAuthor
  }

  async findById(id: number): Promise<CommentWithAuthor | null> {
    const comment = this.items.find((item) => item.id === id)
    if (!comment) return null

    return {
      ...comment,
      author: {
        id: 1,
        publicId: comment.authorId,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        birthDate: null,
        description: null,
        profilePicture: null,
        loginAttempts: 0,
        lastLogin: null,
        passwordDigest: 'hashed-password',
        role: 'NORMAL_USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPrivate: false,
      } as User,
    }
  }

  async findByPublicId(publicId: string): Promise<CommentWithAuthor | null> {
    const comment = this.items.find((item) => item.publicId === publicId)
    if (!comment) return null

    return {
      ...comment,
      author: {
        id: 1,
        publicId: comment.authorId,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        birthDate: null,
        description: null,
        profilePicture: null,
        loginAttempts: 0,
        lastLogin: null,
        passwordDigest: 'hashed-password',
        role: 'NORMAL_USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPrivate: false,
      } as User,
    }
  }

  async delete(id: number): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.items.splice(index, 1)
    }
  }

  async update(
    id: number,
    data: Prisma.CommentUpdateInput
  ): Promise<CommentWithAuthor> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error('Comment not found')
    }

    if (data.content !== undefined) {
      this.items[index].content = data.content as string
    }
    if (data.image !== undefined) {
      this.items[index].image = data.image as string | null
    }
    if (data.likes !== undefined) {
      this.items[index].likes = data.likes as number
    }

    this.items[index].updatedAt = new Date()

    return {
      ...this.items[index],
      author: {
        id: 1,
        publicId: this.items[index].authorId,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        birthDate: null,
        description: null,
        profilePicture: null,
        loginAttempts: 0,
        lastLogin: null,
        passwordDigest: 'hashed-password',
        role: 'NORMAL_USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPrivate: false,
      } as User,
    }
  }
}
