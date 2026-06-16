import { Injectable } from '@nestjs/common';
import { ActivityAction, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { WorkspaceAccessService } from '../workspace-access/workspace-access.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceAccessService: WorkspaceAccessService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createActivity(params: {
    workspaceId: string;
    userId: string;
    action: ActivityAction;
    description: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    const activity = await this.prisma.activityLog.create({
      data: {
        workspaceId: params.workspaceId,
        userId: params.userId,
        action: params.action,
        description: params.description,
        metadata: params.metadata,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    this.notificationsService.sendToWorkspace(
      params.workspaceId,
      'activity.created',
      {
        activity,
      },
    );

    return activity;
  }

  async findWorkspaceActivities(userId: string, workspaceId: string) {
    await this.workspaceAccessService.requireMember(userId, workspaceId);

    return this.prisma.activityLog.findMany({
      where: {
        workspaceId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
