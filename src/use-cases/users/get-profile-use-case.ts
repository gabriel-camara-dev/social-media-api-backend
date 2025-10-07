import {
  HTTPUserProfileInfo,
  UserPresenter,
} from '../../http/presenters/user-presenter'
import {
  UserProfileInfo,
  UsersRepository,
} from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetProfileUseCaseRequest {
  userId: string
}

interface GetProfileUseCaseResponse {
  user: HTTPUserProfileInfo
}

export class GetProfileUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.usersRepository.getUserProfileInfo(userId)

    if (user === null) {
      throw new ResourceNotFoundError()
    }

    return {
      user: UserPresenter.toHTTPProfile(user),
    }
  }
}