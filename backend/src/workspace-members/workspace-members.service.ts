import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { InviteMemberDto } from './dto/invite-member.dto';
import { WorkspaceAccessService } from '../workspace-access/workspace-access.service';
import { Role } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class WorkspaceMembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private workspaceAccessService: WorkspaceAccessService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async inviteMember(
    currentUserId: string,
    workspaceId: string,
    inviteMemberDto: InviteMemberDto,
  ) {
    await this.workspaceAccessService.requireAdmin(currentUserId, workspaceId);

    const userToInvite = await this.usersService.findByEmail(
      inviteMemberDto.email,
    );

    if (!userToInvite) {
      throw new NotFoundException('User with this email not found');
    }

    const existingUser = await this.prisma.workspaceMember.findFirst({
      where: {
        userId: userToInvite.id,
        workspaceId,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'User is already a member of this workspaces',
      );
    }

    const member = await this.prisma.workspaceMember.create({
      data: {
        userId: userToInvite.id,
        workspaceId,
        role: inviteMemberDto.role,
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
        workspace: true,
      },
    });

    await this.notificationsService.createForUser({
      userId: userToInvite.id,
      title: 'Workspace Invitation',
      message: `You have been invited to workspace "${member.workspace.name}" as ${member.role}`,
      type: 'WORKSPACE_INVITE',
    });

    return member;
  }

  async findAll(currentUserId: string, workspaceId: string) {
    await this.workspaceAccessService.requireMember(currentUserId, workspaceId);

    return this.prisma.workspaceMember.findMany({
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
        createdAt: 'asc',
      },
    });
  }

  async updateRole(
    currentUserId: string,
    workspaceId: string,
    memberId: string,
    role: Role,
  ) {
    await this.workspaceAccessService.requireAdmin(currentUserId, workspaceId);

    const member = await this.prisma.workspaceMember.findFirst({
      where: {
        id: memberId,
        workspaceId,
      },
    });

    if (!member) {
      throw new NotFoundException('Workspace member not found');
    }

    return this.prisma.workspaceMember.update({
      where: {
        id: memberId,
      },
      data: {
        role,
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
  }

  async removeMember(
    currentUserId: string,
    workspaceId: string,
    memberId: string,
  ) {
    await this.workspaceAccessService.requireAdmin(currentUserId, workspaceId);

    const member = await this.prisma.workspaceMember.findFirst({
      where: {
        id: memberId,
        workspaceId,
      },
    });

    if (!member) {
      throw new NotFoundException('Workspace member not found');
    }

    await this.prisma.workspaceMember.delete({
      where: {
        id: memberId,
      },
    });

    return null;
  }
}
