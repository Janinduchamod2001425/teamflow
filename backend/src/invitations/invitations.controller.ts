import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { InvitationsService } from './invitations.service';
import { RespondInvitationDto } from './dto/respond-invitation.dto';

@ApiBearerAuth()
@ApiTags('Invitations')
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Get('me')
  @ResponseMessage('Pending invitations retrieved successfully')
  @ApiOperation({ summary: 'Get my pending workspace invitations' })
  findMyInvitations(@CurrentUser() user: { userId: string; email: string }) {
    return this.invitationsService.findMyInvitations(user.userId);
  }

  @Patch(':invitationId/respond')
  @ResponseMessage('Invitation response recorded')
  @ApiOperation({ summary: 'Accept or decline a workspace invitation' })
  respond(
    @CurrentUser() user: { userId: string; email: string },
    @Param('invitationId') invitationId: string,
    @Body() dto: RespondInvitationDto,
  ) {
    return this.invitationsService.respond(
      user.userId,
      invitationId,
      dto.status,
    );
  }
}
