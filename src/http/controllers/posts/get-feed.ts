import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetFeedUseCase } from '../../../use-cases/factories/make-get-feed-use-case'

export async function getFeed(request: FastifyRequest, reply: FastifyReply) {
  const getFeedQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(20),
  })

  const { page, limit } = getFeedQuerySchema.parse(request.query)
  const userId = request.userId

  try {
    const getFeedUseCase = makeGetFeedUseCase()
    const { feed } = await getFeedUseCase.execute({ userId, page, limit })

    return reply.status(200).send({ feed })
  } catch (error) {
    throw error
  }
}
