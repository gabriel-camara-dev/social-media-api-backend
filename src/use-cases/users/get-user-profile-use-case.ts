import {
  UserProfileInfo,
  UsersRepository,
} from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetUserProfileUseCaseRequest {
  publicId: string
}

interface GetUserProfileUseCaseResponse {
  user: UserProfileInfo
}

export class GetUserProfileUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    publicId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.getUserProfileInfo(publicId)

    if (user === null) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
