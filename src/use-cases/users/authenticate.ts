import { User } from '@prisma/client'
import { compare } from 'bcryptjs'
import { UsersRepository } from '../../repositories/users-repository'
import { AuthenticationAuditRepository } from '../../repositories/authentication-audit-repository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
  ipAddress?: string
  remotePort?: string
  browser?: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private authenticationAuditRepository: AuthenticationAuditRepository
  ) {}
  async execute({
    email,
    password,
    ipAddress,
    remotePort,
    browser,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    const auditAuthenticateObject = {
      browser: browser ?? null,
      ipAddress: ipAddress ?? null,
      remotePort: remotePort ?? null,
      userId: user?.id ?? null,
    }

    if (user == null) {
      await this.authenticationAuditRepository.create({
        ...auditAuthenticateObject,
        status: 'USER_NOT_EXISTS',
      })

      throw new InvalidCredentialsError()
    }

    const doesPasswordMatch = await compare(password, user.passwordDigest)

    if (!doesPasswordMatch) {
      await this.authenticationAuditRepository.create({
        ...auditAuthenticateObject,
        status: 'INCORRECT_PASSWORD',
      })

      throw new InvalidCredentialsError()
    }

    await this.usersRepository.setLastLogin(user.id)

    await this.authenticationAuditRepository.create({
      ...auditAuthenticateObject,
      status: 'SUCCESS',
      userId: user.id,
    })
    return {
      user,
    }
  }
}
