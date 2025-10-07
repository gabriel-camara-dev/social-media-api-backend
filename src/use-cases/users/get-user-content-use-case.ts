import {
  UserContent,
  UsersRepository,
} from '../../repositories/users-repository'
import { UserProfileIsPrivateError } from '../errors/user-profile-is-private-error'

interface GetUserContentUseCaseRequest {
  publicId: string
  viewerId?: string
  page: number
  limit: number
}

interface GetUserContentUseCaseResponse {
  content: UserContent
}

export class GetUserContentUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    publicId,
    viewerId,
    page,
    limit,
  }: GetUserContentUseCaseRequest): Promise<GetUserContentUseCaseResponse> {
    const canViewProfile = await this.usersRepository.canViewProfile(
      publicId,
      viewerId
    )
    if (!canViewProfile) {
      const userProfile = await this.usersRepository.findProfileSummaryByPublicId(publicId)
      if (userProfile?.isPrivate) {
        throw new UserProfileIsPrivateError()
      }
    }

    const content = await this.usersRepository.findUserContentByPublicId(
      publicId,
      { page, limit }
    )

    return {
      content,
    }
  }
}