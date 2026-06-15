import { Module } from '@nestjs/common';
import { WorkspaceAccessModule } from '../workspace-access/workspace-access.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [WorkspaceAccessModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
