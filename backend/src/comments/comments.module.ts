import { Module } from '@nestjs/common';
import { WorkspaceAccessModule } from '../workspace-access/workspace-access.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [WorkspaceAccessModule, ActivitiesModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
