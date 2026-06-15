import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { InviteMemberDto } from './dto/invite-member.dto';
import { WorkspaceMembersService } from './workspace-members.service';

@ApiBearerAuth()
@ApiTags('Workspace Members')
@Controller('workspaces/:workspaceId/members')
export class WorkspaceMembersController {
  constructor(
    private readonly workspaceMembersService: WorkspaceMembersService,
  ) {}

  @ResponseMessage('Member invited successfully')
  @ApiOperation({ summary: 'Invite member to workspace' })
  @Post()
  inviteMember(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Body() inviteMemberDto: InviteMemberDto,
  ) {
    return this.workspaceMembersService.inviteMember(
      user.userId,
      workspaceId,
      inviteMemberDto,
    );
  }

  @Get()
  @ResponseMessage('Workspace members retrieved successfully')
  @ApiOperation({ summary: 'Get workspace members' })
  findAll(@Param('workspaceId') workspaceId: string) {
    return this.workspaceMembersService.findAll(workspaceId);
  }
}
