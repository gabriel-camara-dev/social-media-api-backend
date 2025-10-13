import type { FastifyInstance } from 'fastify'
import { Server } from 'socket.io'
import { env } from '../env'

let io: Server | null = null

export function emitToUser(userId: string, event: string, payload: any) {
  if (!io) return
  const nsp = io.of('/notifications')
  nsp.to(userId).emit(event, payload)
}

export function initSocket(app: FastifyInstance) {
  if (!app.server) return
  if (io) return
  io = new Server(app.server, {
    cors: {
      origin: env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  const notifications = io.of('/notifications')

  notifications.use(async (socket, next) => {
    try {
      const tokenFromAuth =
        (socket.handshake.auth && (socket.handshake.auth as any).token) || null
      const tokenFromHeader =
        (socket.handshake.headers.authorization as string | undefined) || null

      const token =
        tokenFromAuth ||
        (tokenFromHeader && tokenFromHeader.startsWith('Bearer ')
          ? tokenFromHeader.split(' ')[1]
          : null)

      if (!token) throw new Error('no token')
      const payload = await app.jwt.verify(token)

      const userId = (payload as any)?.sub
      if (!userId) throw new Error('no sub')

      socket.data.userId = userId
      socket.join(userId)
      next()
    } catch (err) {
      next(new Error('Unauthorized'))
    }
  })

  notifications.on('connection', (socket) => {
    socket.on('disconnect', () => {})
  })
}
