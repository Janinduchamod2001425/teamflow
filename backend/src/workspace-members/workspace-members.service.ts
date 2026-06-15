import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { InviteMemberDto } from './dto/invite-member.dto';
import { Role } from '@prisma/client';

@Injectable()
export class WorkspaceMembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async inviteMember(
    currentUserId: string,
    workspaceId: string,
    inviteMemberDto: InviteMemberDto,
  ) {
    const currentMember = await this.prisma.workspaceMember.findFirst({
      where: {
        userId: currentUserId,
        workspaceId,
      },
    });

    if (!currentMember) {
      throw new NotFoundException('Workspace not found');
    }

    if (currentMember.role !== Role.ADMIN) {
      throw new ForbiddenException('Only workspace admins can invite members');
    }

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
      throw new ConflictException('User is already a member of this workspace');
    }

    return this.prisma.workspaceMember.create({
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
  }

  async findAll(workspaceId: string) {
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
        createdAt: 'asc'
      }
    });
  }
}
