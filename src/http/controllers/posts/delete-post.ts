import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeletePostUseCase } from '../../../use-cases/factories/make-delete-post-use-case'
import { PostNotFoundError } from '../../../use-cases/errors/post-not-found-error'

export async function deletePost(request: FastifyRequest, reply: FastifyReply) {
  const deletePostParamsSchema = z.object({
    publicId: z.string().uuid(),
  })

  const { publicId } = deletePostParamsSchema.parse(request.params)

  try {
    const deletePostUseCase = makeDeletePostUseCase()

    await deletePostUseCase.execute({
      publicId,
    })

    return await reply.status(200).send()
  } catch (err: unknown) {
    if (err instanceof PostNotFoundError) {
      return await reply.status(404).send({ message: err.message })
    }
    throw err
  }
}
