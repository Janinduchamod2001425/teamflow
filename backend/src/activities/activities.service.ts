import { Injectable } from '@nestjs/common';
import { ActivityAction, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { WorkspaceAccessService } from '../workspace-access/workspace-access.service';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

  async createActivity(params: {
    workspaceId: string;
    userId: string;
    action: ActivityAction;
    description: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return this.prisma.activityLog.create({
      data: {
        workspaceId: params.workspaceId,
        userId: params.userId,
        action: params.action,
        description: params.description,
        metadata: params.metadata,
      },
    });
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
