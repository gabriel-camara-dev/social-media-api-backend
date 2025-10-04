import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register-use-case'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

describe('RegisterUseCase', () => {
  it('should hash password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      username: 'johndoe',
      email: 'admin@email.com',
      password: '123456',
    })

    const isPasswordHashed = await compare('123456', user.passwordDigest)

    expect(isPasswordHashed).toBe(true)
  })

  it('should not allow registration with an email or username that is already in use', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'johndoe@example.com'
    const username = 'johndoe'

    await registerUseCase.execute({
      name: 'John Doe',
      username,
      email,
      password: '123456',
    })

    await expect(
      registerUseCase.execute({
        name: 'John Doe',
        username,
        email,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should register a user successfully', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    expect(user.publicId).toEqual(expect.any(String))
  })
})
