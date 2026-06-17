import { Module } from '@nestjs/common';
import { WorkspaceAccessModule } from '../workspace-access/workspace-access.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { ActivitiesModule } from '../activities/activities.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    WorkspaceAccessModule,
    ActivitiesModule,
    NotificationsModule,
    CacheModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
