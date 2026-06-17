import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { NotificationsService } from './notifications.service';

@ApiBearerAuth()
@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ResponseMessage('Notifications retrieved successfully')
  @ApiOperation({ summary: 'Get current user notifications' })
  findAll(@CurrentUser() user: { userId: string; email: string }) {
    return this.notificationsService.findAll(user.userId);
  }

  @Get('unread-count')
  @ResponseMessage('Unread notification count retrieved successfully')
  @ApiOperation({ summary: 'Get unread notification count' })
  unreadCount(@CurrentUser() user: { userId: string; email: string }) {
    return this.notificationsService.unreadCount(user.userId);
  }

  @Patch(':notificationId/read')
  @ResponseMessage('Notification marked as read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(
    @CurrentUser() user: { userId: string; email: string },
    @Param('notificationId') notificationId: string,
  ) {
    return this.notificationsService.markAsRead(user.userId, notificationId);
  }

  @Patch('read-all')
  @ResponseMessage('All notifications marked as read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@CurrentUser() user: { userId: string; email: string }) {
    return this.notificationsService.markAllAsRead(user.userId);
  }
}
