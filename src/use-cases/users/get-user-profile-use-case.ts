import {
  HTTPUserProfileInfo,
  UserPresenter,
} from '../../http/presenters/user-presenter'
import {
  UserProfileInfo,
  UsersRepository,
} from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UserProfileIsPrivateError } from '../errors/user-profile-is-private-error'

interface GetUserProfileUseCaseRequest {
  userId?: string
  publicId: string
}

interface GetUserProfileUseCaseResponse {
  user: HTTPUserProfileInfo
}

export class GetUserProfileUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    userId,
    publicId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const userProfile = await this.usersRepository.getUserProfileInfo(publicId)

    if (userProfile === null) {
      throw new ResourceNotFoundError()
    }

    if (userProfile.isPrivate) {
      const canViewProfile = await this.usersRepository.canViewProfile(
        publicId, // profilePublicId
        userId    // viewerPublicId
      )
      if (!canViewProfile) {
        throw new UserProfileIsPrivateError()
      }
    }

    return {
      user: UserPresenter.toHTTPProfile(userProfile),
    }
  }
}