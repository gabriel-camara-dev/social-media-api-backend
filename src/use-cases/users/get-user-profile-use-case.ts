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
    const canViewProfile = await this.usersRepository.canViewProfile(
      publicId,
      userId || ''
    )

    if (!canViewProfile && userId) {
      const userProfile = await this.usersRepository.findByPublicId(publicId)
      if (userProfile?.isPrivate) {
        throw new UserProfileIsPrivateError()
      }
    }

    const user = await this.usersRepository.getUserProfileInfo(publicId)

    if (user === null) {
      throw new ResourceNotFoundError()
    }

    return {
      user: UserPresenter.toHTTPProfile(user),
    }
  }
}