import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActivityAction, Role } from '@prisma/client';
import { ActivitiesService } from '../activities/activities.service';
import { PrismaService } from '../prisma/prisma.service';
import { WorkspaceAccessService } from '../workspace-access/workspace-access.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceAccessService: WorkspaceAccessService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  async create(
    userId: string,
    workspaceId: string,
    projectId: string,
    createTaskDto: CreateTaskDto,
  ) {
    await this.workspaceAccessService.requireMember(userId, workspaceId);

    await this.ensureProjectBelongsToWorkspace(projectId, workspaceId);

    if (createTaskDto.assigneeId) {
      await this.ensureUserIsWorkspaceMember(
        createTaskDto.assigneeId,
        workspaceId,
      );
    }

    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        priority: createTaskDto.priority,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
        projectId,
        assigneeId: createTaskDto.assigneeId,
        createdById: userId,
      },
      include: this.taskInclude(),
    });

    await this.activitiesService.createActivity({
      workspaceId,
      userId,
      action: ActivityAction.TASK_CREATED,
      description: `Created task "${task.title}"`,
      metadata: {
        taskId: task.id,
        taskTitle: task.title,
        projectId,
      },
    });

    return task;
  }

  async findAll(userId: string, workspaceId: string, projectId: string) {
    await this.workspaceAccessService.requireMember(userId, workspaceId);

    await this.ensureProjectBelongsToWorkspace(projectId, workspaceId);

    return this.prisma.task.findMany({
      where: {
        projectId,
      },
      include: this.taskInclude(),
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(
    userId: string,
    workspaceId: string,
    projectId: string,
    taskId: string,
  ) {
    await this.workspaceAccessService.requireMember(userId, workspaceId);

    await this.ensureProjectBelongsToWorkspace(projectId, workspaceId);

    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
      },
      include: this.taskInclude(),
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(
    userId: string,
    workspaceId: string,
    projectId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    await this.workspaceAccessService.requireMember(userId, workspaceId);

    await this.ensureProjectBelongsToWorkspace(projectId, workspaceId);

    await this.findOne(userId, workspaceId, projectId, taskId);

    if (updateTaskDto.assigneeId) {
      await this.ensureUserIsWorkspaceMember(
        updateTaskDto.assigneeId,
        workspaceId,
      );
    }

    const task = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title: updateTaskDto.title,
        description: updateTaskDto.description,
        priority: updateTaskDto.priority,
        dueDate: updateTaskDto.dueDate
          ? new Date(updateTaskDto.dueDate)
          : undefined,
        assigneeId: updateTaskDto.assigneeId,
      },
      include: this.taskInclude(),
    });

    await this.activitiesService.createActivity({
      workspaceId,
      userId,
      action: ActivityAction.TASK_UPDATED,
      description: `Updated task "${task.title}"`,
      metadata: {
        taskId: task.id,
        taskTitle: task.title,
        projectId,
      },
    });

    return task;
  }

  async updateStatus(
    userId: string,
    workspaceId: string,
    projectId: string,
    taskId: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    await this.workspaceAccessService.requireMember(userId, workspaceId);

    await this.ensureProjectBelongsToWorkspace(projectId, workspaceId);

    await this.findOne(userId, workspaceId, projectId, taskId);

    const task = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        status: updateTaskStatusDto.status,
      },
      include: this.taskInclude(),
    });

    await this.activitiesService.createActivity({
      workspaceId,
      userId,
      action: ActivityAction.TASK_STATUS_UPDATED,
      description: `Moved task "${task.title}" to ${task.status}`,
      metadata: {
        taskId: task.id,
        taskTitle: task.title,
        status: task.status,
        projectId,
      },
    });

    return task;
  }

  async remove(
    userId: string,
    workspaceId: string,
    projectId: string,
    taskId: string,
  ) {
    await this.workspaceAccessService.requireRole(userId, workspaceId, [
      Role.ADMIN,
      Role.MANAGER,
    ]);

    await this.ensureProjectBelongsToWorkspace(projectId, workspaceId);

    const task = await this.findOne(userId, workspaceId, projectId, taskId);

    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    await this.activitiesService.createActivity({
      workspaceId,
      userId,
      action: ActivityAction.TASK_DELETED,
      description: `Deleted task "${task.title}"`,
      metadata: {
        taskId: task.id,
        taskTitle: task.title,
        projectId,
      },
    });

    return null;
  }

  private async ensureProjectBelongsToWorkspace(
    projectId: string,
    workspaceId: string,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        workspaceId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  private async ensureUserIsWorkspaceMember(
    userId: string,
    workspaceId: string,
  ) {
    const member = await this.prisma.workspaceMember.findFirst({
      where: {
        userId,
        workspaceId,
      },
    });

    if (!member) {
      throw new BadRequestException('Assignee must be a workspace member');
    }

    return member;
  }

  private taskInclude() {
    return {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      project: true,
    };
  }
}
