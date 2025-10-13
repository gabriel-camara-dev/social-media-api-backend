import type { FastifyInstance } from 'fastify'
import { Server as IOServer, type Socket } from 'socket.io'
import { env } from '../env'

let ioRef: IOServer | null = null

function getTokenFromSocket(socket: Socket): string | null {
  const token = socket.handshake.auth?.token as string | undefined
  if (token) return token

  const auth = socket.handshake.headers?.authorization as string | undefined
  if (auth?.startsWith('Bearer ')) return auth.slice('Bearer '.length)

  return null
}

export function pushNotification(recipientId: string, data: any) {
  if (!ioRef) return
  ioRef.to(`user:${recipientId}`).emit('notification:new', data)
}

export default async function notificationsWs(app: FastifyInstance) {
  const io = new IOServer(app.server, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },
    path: '/socket.io',
  })

  ioRef = io

  // Middleware de autenticação no handshake
  io.use((socket, next) => {
    try {
      const token = getTokenFromSocket(socket)
      if (!token) return next(new Error('Unauthorized'))

      const decoded = app.jwt.verify<{ sub?: string }>(token)
      const userId = decoded?.sub
      if (!userId) return next(new Error('Unauthorized'))

      socket.data.userId = userId
      return next()
    } catch {
      return next(new Error('Unauthorized'))
    }
  })

  io.on('connection', (socket) => {
    const userId = socket.data.userId as string
    socket.join(`user:${userId}`)

    socket.emit('connection:ready', { userId })

    socket.on('disconnect', () => {
    })
  })
}
