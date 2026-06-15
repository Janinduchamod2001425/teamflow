import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiBearerAuth()
@ApiTags('Projects')
@Controller('workspaces/:workspaceId/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ResponseMessage('Project created successfully')
  @ApiOperation({ summary: 'Create project in workspace' })
  create(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.create(
      user.userId,
      workspaceId,
      createProjectDto,
    );
  }

  @Get()
  @ResponseMessage('Project retrieved successfully')
  @ApiOperation({ summary: 'Get workspace projects' })
  findAll(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.projectsService.findAll(user.userId, workspaceId);
  }

  @Get(':projectId')
  @ResponseMessage('Project retrieved successfully')
  @ApiOperation({ summary: 'Get project by ID' })
  findOne(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.projectsService.findOne(user.userId, workspaceId, projectId);
  }

  @Patch(':projectId')
  @ResponseMessage('Project updated successfully')
  @ApiOperation({ summary: 'Update project by ID' })
  update(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(
      user.userId,
      workspaceId,
      projectId,
      updateProjectDto,
    );
  }

  @Delete(':projectId')
  @ResponseMessage('Project deleted successfully')
  @ApiOperation({ summary: 'Delete project by ID' })
  remove(
    @CurrentUser() user: { userId: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.projectsService.remove(user.userId, workspaceId, projectId);
  }
}
