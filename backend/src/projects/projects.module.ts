import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { WorkspaceAccessModule } from '../workspace-access/workspace-access.module';
import { ActivitiesModule } from '../activities/activities.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [WorkspaceAccessModule, ActivitiesModule, CacheModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
