// src/http/controllers/upload-profile-picture.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeUploadProfilePictureUseCase } from '../../../use-cases/factories/make-upload-profile-picture-use-case'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'

export async function uploadProfilePicture(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const file = (request as any).file
  const filename = file?.filename

  if (!file || !filename) {
    return reply.status(400).send({
      message: 'Nenhum arquivo foi enviado.',
    })
  }

  try {
    const publicId = request.userId

    if (!publicId) {
      return reply.status(401).send({ message: 'Unauthorized' })
    }

    const uploadProfilePictureUseCase = makeUploadProfilePictureUseCase()

    const result = await uploadProfilePictureUseCase.execute({
      publicId,
      filename,
    })

    return reply.status(200).send({
      profilePicture: result.profilePicture,
      message: 'Profile picture uploaded successfully',
    })
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: 'User not found' })
    }

    throw error
  }
}
