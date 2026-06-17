import { Injectable } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { WorkspaceAccessService } from '../workspace-access/workspace-access.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

  async getWorkspaceDashboard(userId: string, workspaceId: string) {
    await this.workspaceAccessService.requireMember(userId, workspaceId);

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
        take: 5,
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

    return {
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
  }
}
