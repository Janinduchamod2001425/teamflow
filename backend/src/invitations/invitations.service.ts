import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MembershipStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class InvitationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findMyInvitations(userId: string) {
    return this.prisma.workspaceMember.findMany({
      where: {
        userId,
        status: MembershipStatus.PENDING,
      },
      include: {
        workspace: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async respond(
    userId: string,
    invitationId: string,
    status: 'ACCEPTED' | 'DECLINED',
  ) {
    const invitation = await this.prisma.workspaceMember.findFirst({
      where: {
        id: invitationId,
        userId,
        status: MembershipStatus.PENDING,
      },
      include: {
        workspace: true,
      },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (status === 'DECLINED') {
      await this.prisma.workspaceMember.delete({
        where: { id: invitationId },
      });

      return { status: 'DECLINED' };
    }

    const member = await this.prisma.workspaceMember.update({
      where: { id: invitationId },
      data: { status: MembershipStatus.ACCEPTED },
      include: {
        workspace: true,
      },
    });

    return member;
  }
}
