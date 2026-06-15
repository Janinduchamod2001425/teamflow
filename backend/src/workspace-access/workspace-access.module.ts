import { Module } from '@nestjs/common';
import { WorkspaceAccessService } from './workspace-access.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WorkspaceAccessService],
  exports: [WorkspaceAccessService],
})
export class WorkspaceAccessModule {}
