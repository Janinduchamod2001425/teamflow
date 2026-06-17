import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { DashboardService } from './dashboard.service';

@ApiBearerAuth()
@ApiTags('Dashboard')
@Controller('workspaces/:workspaceId/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ResponseMessage('Workspace dashboard retrieved successfully')
  @ApiOperation({ summary: 'Get workspace dashboard analytics' })
  getWorkspaceDashboard(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.dashboardService.getWorkspaceDashboard(
      user.userId,
      workspaceId,
    );
  }
}
