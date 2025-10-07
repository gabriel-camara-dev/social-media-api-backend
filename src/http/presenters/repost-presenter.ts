import { Comment, Posts, Repost, User } from '@prisma/client'
import { CommentPresenter, HTTPComment } from './comment-presenter'
import { HTTPPost, PostPresenter } from './post-presenter'

export interface HTTPRepost {
  id: string
  createdAt: Date
  user: {
    id: string
    name: string
    username: string
    profilePicture: string | null
  }
  post?: HTTPPost
  comment?: HTTPComment
}

export type RepostWithDetails = Repost & {
  user: User
  post: (Posts & { author: User }) | null
  comment: (Comment & { author: User }) | null
}

export class RepostPresenter {
  static toHTTP(repost: RepostWithDetails): HTTPRepost {
    const response: HTTPRepost = {
      id: repost.publicId,
      createdAt: repost.createdAt,
      user: {
        id: repost.user.publicId,
        name: repost.user.name,
        username: repost.user.username,
        profilePicture: repost.user.profilePicture,
      },
    }

    if (repost.post) {
      response.post = PostPresenter.toHTTP(repost.post)
    }

    if (repost.comment) {
      response.comment = CommentPresenter.toHTTP(repost.comment)
    }

    return response
  }
}
