import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiBearerAuth()
@ApiTags('Comments')
@Controller(
  'workspaces/:workspaceId/projects/:projectId/tasks/:taskId/comments',
)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ResponseMessage('Comment created successfully')
  @ApiOperation({ summary: 'Create comment on task' })
  create(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(
      user.userId,
      workspaceId,
      projectId,
      taskId,
      createCommentDto,
    );
  }

  @Get()
  @ResponseMessage('Comments retrieved successfully')
  @ApiOperation({ summary: 'Get task comments' })
  findAll(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.commentsService.findAll(
      user.userId,
      workspaceId,
      projectId,
      taskId,
    );
  }

  @Patch(':commentId')
  @ResponseMessage('Comment updated successfully')
  @ApiOperation({ summary: 'Update comment' })
  update(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(
      user.userId,
      workspaceId,
      projectId,
      taskId,
      commentId,
      updateCommentDto,
    );
  }

  @Delete(':commentId')
  @ResponseMessage('Comment deleted successfully')
  @ApiOperation({ summary: 'Delete comment' })
  remove(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentsService.remove(
      user.userId,
      workspaceId,
      projectId,
      taskId,
      commentId,
    );
  }
}
