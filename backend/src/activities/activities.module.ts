import { Module } from '@nestjs/common';
import { WorkspaceAccessModule } from '../workspace-access/workspace-access.module';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';

@Module({
  imports: [WorkspaceAccessModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
