import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@ApiBearerAuth()
@ApiTags('Workspace Members')
@Controller('workspaces/:workspaceId/members')
export class WorkspaceMembersController {
  constructor(
    private readonly workspaceMembersService: WorkspaceMembersService,
  ) {}

  @ResponseMessage('Member invited successfully')
  @ApiOperation({ summary: 'Invite member to workspaces' })
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
  @ApiOperation({ summary: 'Get workspaces members' })
  findAll(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.workspaceMembersService.findAll(user.userId, workspaceId);
  }

  @Patch(':memberId/role')
  @ResponseMessage('Member role updated successfully')
  @ApiOperation({ summary: 'Update workspaces member role' })
  updateRole(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('memberId') memberId: string,
    @Body() updateMemberRoleDto: UpdateMemberRoleDto,
  ) {
    return this.workspaceMembersService.updateRole(
      user.userId,
      workspaceId,
      memberId,
      updateMemberRoleDto.role,
    );
  }

  @Delete(':memberId')
  @ResponseMessage('Member removed successfully')
  @ApiOperation({ summary: 'Remove workspaces member' })
  removeMember(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.workspaceMembersService.removeMember(
      user.userId,
      workspaceId,
      memberId,
    );
  }
}
