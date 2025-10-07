import { PostsRepository } from '../../repositories/posts-repository'
import { UsersRepository } from '../../repositories/users-repository'

interface GetFeedUseCaseRequest {
  userId?: string
  page: number
  limit: number
}

interface GetFeedUseCaseResponse {
  feed: any[]
}

export class GetFeedUseCase {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    page,
    limit,
  }: GetFeedUseCaseRequest): Promise<GetFeedUseCaseResponse> {
    let followedUserIds: string[] | undefined

    if (userId) {
      const following = await this.usersRepository.listFollowing(userId)
      if (following.length > 0) {
        followedUserIds = following.map((f) => f.publicId)
      }
    }

    const feedItems = await this.postsRepository.findManyByRelevance({
      page,
      limit,
      followedUserIds,
    })

    const formattedFeed = feedItems.map((item) => {
      const baseItem = {
        id: item.publicId,
        type: item.type,
        score: item.score,
        createdAt: item.createdAt,
        author: {
          id: item.authorId,
          name: item.authorName,
          username: item.authorUsername,
          profilePicture: item.authorProfilePicture,
        },
      }

      if (item.type === 'post') {
        return {
          ...baseItem,
          content: item.content,
          image: item.image,
        }
      } else {
        return {
          ...baseItem,
          originalPost: {
            content: item.content,
            image: item.image,
          },
        }
      }
    })

    return { feed: formattedFeed }
  }
}
