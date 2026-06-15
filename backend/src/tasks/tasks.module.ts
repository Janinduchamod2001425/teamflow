import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { WorkspaceAccessModule } from '../workspace-access/workspace-access.module';

@Module({
  imports: [WorkspaceAccessModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
