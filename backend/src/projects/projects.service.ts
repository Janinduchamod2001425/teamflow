import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkspaceAccessService } from '../workspace-access/workspace-access.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ActivityAction, Role } from '@prisma/client';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ActivitiesService } from '../activities/activities.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceAccessService: WorkspaceAccessService,
    private readonly activitiesService: ActivitiesService,
    private readonly cacheService: CacheService,
  ) {}

  async create(
    userId: string,
    workspaceId: string,
    createProjectDto: CreateProjectDto,
  ) {
    await this.workspaceAccessService.requireRole(userId, workspaceId, [
      Role.ADMIN,
      Role.MANAGER,
    ]);

    const project = await this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        color: createProjectDto.color,
        workspaceId,
      },
    });

    await this.activitiesService.createActivity({
      workspaceId,
      userId,
      action: ActivityAction.PROJECT_CREATED,
      description: `Created project "${project.name}"`,
      metadata: {
        projectId: project.id,
        projectName: project.name,
      },
    });

    await this.cacheService.delete(`dashboard:${workspaceId}`);

    return project;
  }

  async findAll(userId: string, workspaceId: string) {
    await this.workspaceAccessService.requireMember(userId, workspaceId);

    return this.prisma.project.findMany({
      where: {
        workspaceId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: string, workspaceId: string, projectId: string) {
    await this.workspaceAccessService.requireMember(userId, workspaceId);

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

  async update(
    userId: string,
    workspaceId: string,
    projectId: string,
    updateProjectDto: UpdateProjectDto,
  ) {
    await this.workspaceAccessService.requireRole(userId, workspaceId, [
      Role.ADMIN,
      Role.MANAGER,
    ]);

    await this.findOne(userId, workspaceId, projectId);

    const project = await this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: updateProjectDto,
    });

    await this.activitiesService.createActivity({
      workspaceId,
      userId,
      action: ActivityAction.PROJECT_UPDATED,
      description: `Updated project "${project.name}"`,
      metadata: {
        projectId: project.id,
        projectName: project.name,
      },
    });

    await this.cacheService.delete(`dashboard:${workspaceId}`);

    return project;
  }

  async remove(userId: string, workspaceId: string, projectId: string) {
    await this.workspaceAccessService.requireRole(userId, workspaceId, [
      Role.ADMIN,
      Role.MANAGER,
    ]);

    const project = await this.findOne(userId, workspaceId, projectId);

    await this.prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    await this.activitiesService.createActivity({
      workspaceId,
      userId,
      action: ActivityAction.PROJECT_DELETED,
      description: `Deleted project "${project.name}"`,
      metadata: {
        projectId: project.id,
        projectName: project.name,
      },
    });

    await this.cacheService.delete(`dashboard:${workspaceId}`);

    return null;
  }
}
