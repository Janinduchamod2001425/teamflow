import { Injectable } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { WorkspaceAccessService } from '../workspace-access/workspace-access.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceAccessService: WorkspaceAccessService,
    private readonly cacheService: CacheService,
  ) {}

  async getWorkspaceDashboard(userId: string, workspaceId: string) {
    await this.workspaceAccessService.requireMember(userId, workspaceId);

    const cacheKey = `dashboard:${workspaceId}`;

    const cachedDashboard = await this.cacheService.get(cacheKey);

    if (cachedDashboard) {
      return cachedDashboard;
    }

    const [
      totalProjects,
      totalMembers,
      totalTasks,
      todoTasks,
      inProgressTasks,
      reviewTasks,
      completedTasks,
      overdueTasks,
      recentActivities,
    ] = await Promise.all([
      this.prisma.project.count({
        where: { workspaceId },
      }),

      this.prisma.workspaceMember.count({
        where: { workspaceId },
      }),

      this.prisma.task.count({
        where: {
          project: { workspaceId },
        },
      }),

      this.prisma.task.count({
        where: {
          project: { workspaceId },
          status: TaskStatus.TODO,
        },
      }),

      this.prisma.task.count({
        where: {
          project: { workspaceId },
          status: TaskStatus.IN_PROGRESS,
        },
      }),

      this.prisma.task.count({
        where: {
          project: { workspaceId },
          status: TaskStatus.REVIEW,
        },
      }),

      this.prisma.task.count({
        where: {
          project: { workspaceId },
          status: TaskStatus.DONE,
        },
      }),

      this.prisma.task.count({
        where: {
          project: { workspaceId },
          dueDate: {
            lt: new Date(),
          },
          status: {
            not: TaskStatus.DONE,
          },
        },
      }),

      this.prisma.activityLog.findMany({
        where: { workspaceId },
        take: 10,
        orderBy: { createdAt: 'desc' },
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
      }),
    ]);

    const completionRate =
      totalTasks === 0
        ? 0
        : Number(((completedTasks / totalTasks) * 100).toFixed(2));

    const dashboard = {
      overview: {
        totalProjects,
        totalMembers,
        totalTasks,
        completedTasks,
        overdueTasks,
        completionRate,
      },
      tasksByStatus: {
        TODO: todoTasks,
        IN_PROGRESS: inProgressTasks,
        REVIEW: reviewTasks,
        DONE: completedTasks,
      },
      recentActivities,
    };

    await this.cacheService.set(cacheKey, dashboard, 60);

    return dashboard;
  }
}
