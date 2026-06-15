import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkspaceAccessService } from '../workspace-access/workspace-access.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Role } from '@prisma/client';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceAccessService: WorkspaceAccessService,
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

    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        color: createProjectDto.color,
        workspaceId,
      },
    });
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

    return this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: updateProjectDto,
    });
  }

  async remove(userId: string, workspaceId: string, projectId: string) {
    await this.workspaceAccessService.requireRole(userId, workspaceId, [
      Role.ADMIN,
      Role.MANAGER,
    ]);

    await this.findOne(userId, workspaceId, projectId);

    await this.prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return null;
  }
}
