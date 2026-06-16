import { Module } from '@nestjs/common';
import { WorkspaceAccessModule } from '../workspace-access/workspace-access.module';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [WorkspaceAccessModule, NotificationsModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
