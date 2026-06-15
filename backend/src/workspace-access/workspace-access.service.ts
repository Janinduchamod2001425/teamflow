import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class WorkspaceAccessService {
  constructor(private readonly prisma: PrismaService) {}

  async requireMember(userId: string, workspaceId: string) {
    const member = await this.prisma.workspaceMember.findFirst({
      where: {
        userId,
        workspaceId,
      },
    });

    if (!member) {
      throw new NotFoundException('Workspace not found');
    }

    return member;
  }

  async requireRole(
    userId: string,
    workspaceId: string,
    allowedRoles: string[],
  ) {
    const member = await this.requireMember(userId, workspaceId);

    if (!allowedRoles.includes(member.role)) {
      throw new ForbiddenException(
        'You do not have permission for this action',
      );
    }

    return member;
  }

  async requireAdmin(userId: string, workspaceId: string) {
    return this.requireRole(userId, workspaceId, [Role.ADMIN]);
  }

  async requireManager(userId: string, workspaceId: string) {
    return this.requireRole(userId, workspaceId, [Role.ADMIN, Role.MANAGER]);
  }
}
