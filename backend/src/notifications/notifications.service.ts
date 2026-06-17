import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsGateway: NotificationsGateway,
    private readonly prisma: PrismaService,
  ) {}

  sendToWorkspace(workspaceId: string, event: string, payload: any) {
    this.notificationsGateway.emitToWorkspace(workspaceId, event, payload);
  }

  sendToUser(userId: string, event: string, payload: any) {
    this.notificationsGateway.emitToUser(userId, event, payload);
  }

  async createForUser(params: {
    userId: string;
    title: string;
    message: string;
    type: string;
  }) {
    const notification = await this.prisma.notification.create({
      data: params,
    });

    this.sendToUser(params.userId, 'notification.created', notification);

    return notification;
  }

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async unreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { count };
  }

  async markAsRead(userId: string, notificationId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }
}
