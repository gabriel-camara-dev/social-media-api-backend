import { Posts, Prisma, User } from '@prisma/client'
import {
  PostsRepository,
  PostsWithAuthor,
  PostWithComments,
} from '../posts-repository'

class InMemoryPostsRepository implements PostsRepository {
  public items: Posts[] = []

  async create(
    data: Prisma.PostsUncheckedCreateInput
  ): Promise<PostsWithAuthor> {
    const post: Posts = {
      id: this.items.length + 1,
      publicId: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: data.content,
      image: data.image || null,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: data.userId,
    }

    this.items.push(post)

    const postWithAuthor: PostsWithAuthor = {
      ...post,
      author: {
        id: 1,
        publicId: data.userId,
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

    return postWithAuthor
  }

  async findById(id: number): Promise<PostsWithAuthor | null> {
    const post = this.items.find((item) => item.id === id)
    if (!post) return null

    return {
      ...post,
      author: {
        id: 1,
        publicId: post.userId,
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

  async findByPublicId(
    publicId: string,
    options?: { commentsLimit?: number; repliesLimit?: number }
  ) {
    const post = this.items.find((item) => item.publicId === publicId)
    if (!post) {
      return null
    }

    const postWithComments: PostWithComments = {
      ...post,
      author: {
        id: 1,
        publicId: post.userId,
        name: 'Test user',
        username: 'test_user',
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'testuser@gmail.com',
        birthDate: null,
        description: null,
        profilePicture: null,
        loginAttempts: 0,
        lastLogin: null,
        passwordDigest: 'hashed-password',
        role: 'NORMAL_USER',
        isPrivate: false,
      },
      comments: [],
      totalPages: 0,
    }

    return postWithComments
  }

  async delete(publicId: string): Promise<void> {
    const index = this.items.findIndex((item) => item.publicId === publicId)
    if (index !== -1) {
      this.items.splice(index, 1)
    }
  }

  async update(
    publicId: string,
    data: Prisma.PostsUpdateInput
  ): Promise<PostsWithAuthor> {
    const index = this.items.findIndex((item) => item.publicId === publicId)

    if (data.content !== undefined) {
      this.items[index].content = data.content as string
      this.items[index].updatedAt = new Date()
    }

    this.items[index].updatedAt = new Date()

    return {
      ...this.items[index],
      author: {
        id: 1,
        publicId: this.items[index].userId,
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
