import { FastifyRequest, FastifyReply } from 'fastify'
import { makeDeleteProfilePictureUseCase } from '../../../use-cases/factories/make-delete-profile-picture-use-case'
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'

export async function deleteProfilePicture(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const publicId = request.userId

    if (!publicId) {
      return reply.status(401).send({ message: 'Unauthorized' })
    }

    const deleteProfilePictureUseCase = makeDeleteProfilePictureUseCase()

    await deleteProfilePictureUseCase.execute({
      publicId,
    })

    return reply.status(200).send({
      message: 'Profile picture deleted successfully',
    })
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: 'No profile picture found' })
    }

    throw error
  }
}
