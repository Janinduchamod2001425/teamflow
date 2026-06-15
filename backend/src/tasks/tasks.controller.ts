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
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('workspaces/:workspaceId/projects/:projectId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ResponseMessage('Task created successfully')
  @ApiOperation({ summary: 'Create task in project' })
  create(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(
      user.userId,
      workspaceId,
      projectId,
      createTaskDto,
    );
  }

  @Get()
  @ResponseMessage('Tasks retrieved successfully')
  @ApiOperation({ summary: 'Get project tasks' })
  findAll(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.tasksService.findAll(user.userId, workspaceId, projectId);
  }

  @Get(':taskId')
  @ResponseMessage('Task retrieved successfully')
  @ApiOperation({ summary: 'Get task by ID' })
  findOne(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.tasksService.findOne(
      user.userId,
      workspaceId,
      projectId,
      taskId,
    );
  }

  @Patch(':taskId')
  @ResponseMessage('Task updated successfully')
  @ApiOperation({ summary: 'Update task by ID' })
  update(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(
      user.userId,
      workspaceId,
      projectId,
      taskId,
      updateTaskDto,
    );
  }

  @Patch(':taskId/status')
  @ResponseMessage('Task status updated successfully')
  @ApiOperation({ summary: 'Update task status' })
  updateStatus(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    return this.tasksService.updateStatus(
      user.userId,
      workspaceId,
      projectId,
      taskId,
      updateTaskStatusDto,
    );
  }

  @Delete(':taskId')
  @ResponseMessage('Task deleted successfully')
  @ApiOperation({ summary: 'Delete task by ID' })
  remove(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.tasksService.remove(
      user.userId,
      workspaceId,
      projectId,
      taskId,
    );
  }
}
