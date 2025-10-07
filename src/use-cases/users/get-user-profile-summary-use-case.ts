import {
  UserProfileSummary,
  UsersRepository,
} from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UserProfileIsPrivateError } from '../errors/user-profile-is-private-error'

interface GetUserProfileSummaryUseCaseRequest {
  publicId: string
  viewerId?: string
}

interface GetUserProfileSummaryUseCaseResponse {
  user: UserProfileSummary
}

export class GetUserProfileSummaryUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    publicId,
    viewerId,
  }: GetUserProfileSummaryUseCaseRequest): Promise<GetUserProfileSummaryUseCaseResponse> {
    const userProfile =
      await this.usersRepository.findProfileSummaryByPublicId(publicId)

    if (userProfile === null) {
      throw new ResourceNotFoundError()
    }

    if (userProfile.isPrivate) {
      const canView = await this.usersRepository.canViewProfile(
        publicId,
        viewerId
      )
      if (!canView) {
        throw new UserProfileIsPrivateError()
      }
    }

    return {
      user: userProfile,
    }
  }
}
