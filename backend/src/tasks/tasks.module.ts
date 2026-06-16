import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { WorkspaceAccessModule } from '../workspace-access/workspace-access.module';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [WorkspaceAccessModule, ActivitiesModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
