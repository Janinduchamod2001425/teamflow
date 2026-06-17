import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { AttachmentsService } from './attachments.service';

@ApiBearerAuth()
@ApiTags('Attachments')
@Controller('workspaces/:workspaceId/tasks/:taskId/attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post()
  @ResponseMessage('Attachment uploaded successfully')
  @ApiOperation({ summary: 'Upload task attachment' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  upload(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.attachmentsService.upload(
      user.userId,
      workspaceId,
      taskId,
      file,
    );
  }

  @Get()
  @ResponseMessage('Attachments retrieved successfully')
  @ApiOperation({ summary: 'Get task attachments' })
  findAll(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.attachmentsService.findAll(user.userId, workspaceId, taskId);
  }

  @Delete(':attachmentId')
  @ResponseMessage('Attachment deleted successfully')
  @ApiOperation({ summary: 'Delete task attachment' })
  remove(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    return this.attachmentsService.remove(
      user.userId,
      workspaceId,
      taskId,
      attachmentId,
    );
  }
}
