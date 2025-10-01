import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { PrismaAuthenticationAuditRepository } from '../../repositories/prisma/prisma-authentication-audit-repository'
import { AuthenticateUseCase } from '../users/authenticate'

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const authenticationAuditRepository =
    new PrismaAuthenticationAuditRepository()
  const authenticateUseCase = new AuthenticateUseCase(
    usersRepository,
    authenticationAuditRepository
  )

  return authenticateUseCase
}
