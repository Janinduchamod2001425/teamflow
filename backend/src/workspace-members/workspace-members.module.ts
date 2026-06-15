import { Module } from '@nestjs/common';
import { WorkspaceMembersController } from './workspace-members.controller';
import { WorkspaceMembersService } from './workspace-members.service';
import { UsersModule } from '../users/users.module';
import { WorkspaceAccessModule } from '../workspace-access/workspace-access.module';

@Module({
  imports: [UsersModule, WorkspaceAccessModule],
  controllers: [WorkspaceMembersController],
  providers: [WorkspaceMembersService],
})
export class WorkspaceMembersModule {}
