import { Module } from '@nestjs/common';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { MulterModule } from '@nestjs/platform-express';
import { WorkspaceAccessModule } from '../workspace-access/workspace-access.module';

@Module({
  imports: [MulterModule.register(), WorkspaceAccessModule],
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
})
export class AttachmentsModule {}
