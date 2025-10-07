import { FastifyInstance } from 'fastify'
import { toggleRepost } from './toggle-repost'
import { authentication } from '../../middlewares/authentication'

export async function repostsRoutes(app: FastifyInstance) {
  app.post('/toggle', { preHandler: [authentication] }, toggleRepost)
}
