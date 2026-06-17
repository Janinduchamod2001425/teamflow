import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { WorkspaceAccessModule } from '../workspace-access/workspace-access.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [WorkspaceAccessModule, CacheModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
