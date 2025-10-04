import { Posts, Prisma, User, Comment } from '@prisma/client'
import {
  PostsRepository,
  PostsWithAuthor,
  PostWithComments,
} from '../posts-repository'
import { CommentWithAuthorAndReplies } from '../../http/presenters/comment-presenter'

export class InMemoryPostsRepository implements PostsRepository {
  public items: Posts[] = []
  public comments: Comment[] = []

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

    const commentsLimit = options?.commentsLimit || 10
    const repliesLimit = options?.repliesLimit || 3

    const postComments = this.comments
      .filter(
        (comment) => comment.postId === publicId && comment.parentId === null
      )
      .slice(0, commentsLimit)

    const commentsWithReplies: CommentWithAuthorAndReplies[] = postComments.map(
      (comment) => {
        const commentReplies = this.comments
          .filter((reply) => reply.parentId === comment.publicId)
          .slice(0, repliesLimit)

        return {
          ...comment,
          author: {
            id: 1,
            publicId: comment.authorId,
            name: 'Comment Author',
            username: 'commentauthor',
            email: 'comment@example.com',
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
          },
          replies: commentReplies.map((reply) => ({
            ...reply,
            author: {
              id: 2,
              publicId: reply.authorId,
              name: 'Reply Author',
              username: 'replyauthor',
              email: 'reply@example.com',
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
            },
          })),
        }
      }
    )

    const totalComments = this.comments.filter(
      (comment) => comment.postId === publicId && comment.parentId === null
    ).length
    const totalPages = Math.ceil(totalComments / commentsLimit)

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
      comments: commentsWithReplies,
      totalPages,
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
