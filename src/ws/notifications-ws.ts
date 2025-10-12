import fp from 'fastify-plugin'
import websocket from '@fastify/websocket'
import type { FastifyInstance } from 'fastify'
import { verify } from 'jsonwebtoken'
import { env } from '../env'
import { PrismaUsersRepository } from '../repositories/prisma/prisma-users-repository'

const clients = new Map<string, Set<any>>()

function addClient(userId: string, socket: any) {
  const set = clients.get(userId) ?? new Set()
  set.add(socket)
  clients.set(userId, set)
}

function removeClient(userId: string, socket: any) {
  const set = clients.get(userId)
  if (!set) return
  set.delete(socket)
  if (set.size === 0) clients.delete(userId)
}

function extractAccessToken(req: any): string | null {
  const auth = req.headers?.authorization as string | undefined
  if (auth && auth.startsWith('Bearer ')) {
    return auth.slice(7)
  }

  try {
    const url = new URL(req.url, env.FRONTEND_URL)
    const qToken = url.searchParams.get('token')
    if (qToken) return qToken
  } catch {

  }

  return null
}


export function pushNotification(recipientId: string, data: any) {
  const set = clients.get(recipientId)
  if (!set || set.size === 0) return

  const payload = JSON.stringify({ event: 'notification:new', data })

  for (const ws of set) {
    if (ws.readyState === ws.OPEN) {
      try {
        ws.send(payload)
      } catch {

      }
    }
  }
}

export default fp(async function notificationsWs(app: FastifyInstance) {
  await app.register(websocket)

  app.get('/ws/notifications', { websocket: true }, async (connection, req) => {
    try {
      const token = extractAccessToken(req)
      if (!token) {
        connection.socket.close(4401, 'Unauthorized: token missing')
        return
      }

      const decoded = verify(token, env.JWT_SECRET) as { sub?: string }
      const userId = decoded?.sub
      if (!userId) {
        connection.socket.close(4401, 'Unauthorized: invalid token')
        return
      }

      const usersRepository = new PrismaUsersRepository()
      const user = await usersRepository.findByPublicId(userId)

      if (!user) {
        connection.socket.close(4401, 'Unauthorized: user not found')
        return
      }

      addClient(userId, connection.socket as any)

      connection.socket.on('close', () => {
        removeClient(userId, connection.socket as any)
      })

      connection.socket.on('message', () => {})
    } catch {
      try {
        connection.socket.close(1011, 'Internal error')
      } catch {}
    }
  })
})
