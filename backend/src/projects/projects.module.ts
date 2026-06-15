import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { WorkspaceAccessModule } from '../workspace-access/workspace-access.module';

@Module({
  imports: [WorkspaceAccessModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
