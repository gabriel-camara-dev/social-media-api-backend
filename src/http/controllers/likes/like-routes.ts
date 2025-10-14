import { FastifyInstance } from 'fastify'
import { authentication } from '../../../middlewares/authentication'
import { toggleLike } from './toggle-like'

export default function likesRoutes(app: FastifyInstance) {
  app.post('/toggle', { preHandler: [authentication] }, toggleLike)
}
