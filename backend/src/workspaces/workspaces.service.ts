import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { Role } from '@prisma/client';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createWorkspaceDto: CreateWorkspaceDto) {
    return this.prisma.workspace.create({
      data: {
        name: createWorkspaceDto.name,
        description: createWorkspaceDto.description,
        members: {
          create: {
            userId,
            role: Role.ADMIN,
          },
        },
      },
      include: {
        members: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: string, workspaceId: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
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
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return workspace;
  }

  async update(
    userId: string,
    workspaceId: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    await this.checkWorkspaceRole(userId, workspaceId, [
      Role.ADMIN,
      Role.MANAGER,
    ]);

    return this.prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: updateWorkspaceDto,
    });
  }

  async checkWorkspaceRole(
    userId: string,
    workspaceId: string,
    allowedRole: string[],
  ) {
    const member = await this.prisma.workspaceMember.findFirst({
      where: {
        userId,
        workspaceId,
      },
    });

    if (!member) {
      throw new NotFoundException('Workspace not found');
    }

    if (!allowedRole.includes(member.role)) {
      throw new ForbiddenException(
        'You do not have permission for this action',
      );
    }

    return member;
  }

  async remove(userId: string, workspaceId: string) {
    await this.checkWorkspaceRole(userId, workspaceId, [Role.ADMIN]);

    await this.prisma.workspace.delete({
      where: {
        id: workspaceId,
      },
    });

    return null;
  }
}
