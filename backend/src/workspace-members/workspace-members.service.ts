import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { InviteMemberDto } from './dto/invite-member.dto';
import { WorkspaceAccessService } from '../workspace-access/workspace-access.service';
import { MembershipStatus, Role } from '@prisma/client';
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
        status: MembershipStatus.PENDING,
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
      metadata: { invitationId: member.id, workspaceId },
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

    if (member.role === Role.ADMIN && role !== Role.ADMIN) {
      await this.ensureNotLastAdmin(workspaceId, memberId);
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
      include: {
        workspace: true,
      },
    });

    if (!member) {
      throw new NotFoundException('Workspace member not found');
    }

    const wasPending = member.status === MembershipStatus.PENDING;

    if (member.role === Role.ADMIN && !wasPending) {
      await this.ensureNotLastAdmin(workspaceId, memberId);
    }

    await this.prisma.workspaceMember.delete({
      where: {
        id: memberId,
      },
    });

    if (wasPending) {
      await this.notificationsService.createForUser({
        userId: member.userId,
        title: 'Invitation Cancelled',
        message: `Your invitation to join "${member.workspace.name}" was cancelled by an admin.`,
        type: 'WORKSPACE_INVITE_CANCELLED',
      });
    } else if (currentUserId !== member.userId) {
      await this.notificationsService.createForUser({
        userId: member.userId,
        title: 'Removed from Workspace',
        message: `You have been removed from workspace "${member.workspace.name}".`,
        type: 'WORKSPACE_MEMBER_REMOVED',
      });
    }

    return null;
  }

  private async ensureNotLastAdmin(
    workspaceId: string,
    excludingMemberId: string,
  ) {
    const adminCount = await this.prisma.workspaceMember.count({
      where: {
        workspaceId,
        role: Role.ADMIN,
        status: MembershipStatus.ACCEPTED,
        id: { not: excludingMemberId },
      },
    });

    if (adminCount === 0) {
      throw new ConflictException(
        'Cannot remove the last admin. Promote another member to admin first.',
      );
    }
  }
}
