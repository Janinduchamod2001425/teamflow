import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { ActivitiesService } from './activities.service';

@ApiBearerAuth()
@ApiTags('Activities')
@Controller('workspaces/:workspaceId/activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  @ResponseMessage('Workspace activities retrieved successfully')
  @ApiOperation({ summary: 'Get workspace activities' })
  findWorkspaceActivities(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.activitiesService.findWorkspaceActivities(
      user.userId,
      workspaceId,
    );
  }
}
