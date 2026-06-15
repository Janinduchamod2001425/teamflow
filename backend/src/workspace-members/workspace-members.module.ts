import { Module } from '@nestjs/common';
import { WorkspaceMembersController } from './workspace-members.controller';
import { WorkspaceMembersService } from './workspace-members.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [WorkspaceMembersController],
  providers: [WorkspaceMembersService],
})
export class WorkspaceMembersModule {}
