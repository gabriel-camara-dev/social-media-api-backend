import { PrismaNotificationsRepository } from '../../repositories/prisma/prisma-notifications-repository'
import { NotificationService } from '../services/notification-service'

export function makeNotificationService() {
  const notificationsRepository = new PrismaNotificationsRepository()
  const notificationService = new NotificationService(notificationsRepository)
  return notificationService
}
