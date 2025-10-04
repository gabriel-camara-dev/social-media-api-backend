import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { UpdateUserUseCase } from './update-user-use-case'
import { expect, it, describe } from 'vitest'
import { UsernameAlreadyTakenError } from '../errors/username-already-taken'

describe('UpdateUserUseCase', () => {
  it('should not allow updating to a username that is already taken', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const updateUserUseCase = new UpdateUserUseCase(usersRepository)

    const user = await usersRepository.create({
      name: 'Jane Doe',
      username: 'janedoe',
      email: 'johndoe@gmail.com',
      passwordDigest: '123456',
    })

    const user2 = await usersRepository.create({
      name: 'John Smith',
      username: 'johnsmith',
      email: 'johnsmith@gmail.com',
      passwordDigest: '123456',
    })

    await expect(
      updateUserUseCase.execute({
        userId: user2.publicId,
        data: {
          username: 'janedoe',
        },
      })
    ).rejects.toBeInstanceOf(UsernameAlreadyTakenError)
  })

  it('should update user successfully', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const updateUserUseCase = new UpdateUserUseCase(usersRepository)

    const user = await usersRepository.create({
      name: 'Jane Doe',
      username: 'janedoe',
      email: 'janedoe@gmail.com',
      passwordDigest: '123456',
    })

    const birthDate = new Date('1990-01-01')

    const updatedUser = await updateUserUseCase.execute({
      userId: user.publicId,
      data: {
        name: 'Jane Smith',
        username: 'janesmith',
        description: 'New bio description',
        birthDate: birthDate,
      },
    })

    expect(updatedUser.user.name).toBe('Jane Smith')
    expect(updatedUser.user.username).toBe('janesmith')
    expect(updatedUser.user.birthDate).toEqual(birthDate)
    expect(updatedUser.user.description).toBe('New bio description')
    expect(updatedUser.user.publicId).toBe(user.publicId)
  })

  it('should update partial user data successfully', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const updateUserUseCase = new UpdateUserUseCase(usersRepository)

    const user = await usersRepository.create({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@gmail.com',
      passwordDigest: '123456',
      description: 'Old bio',
    })

    const updatedUser = await updateUserUseCase.execute({
      userId: user.publicId,
      data: {
        name: 'John Updated',
      },
    })

    expect(updatedUser.user.name).toBe('John Updated')
    expect(updatedUser.user.username).toBe('johndoe')
    expect(updatedUser.user.email).toBe('johndoe@gmail.com')
    expect(updatedUser.user.description).toBe('Old bio')
  })
})
