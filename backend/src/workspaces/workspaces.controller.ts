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
import { WorkspacesService } from './workspaces.service';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@ApiBearerAuth()
@ApiTags()
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @ResponseMessage('Workspace created successfully')
  @ApiOperation({ summary: 'Create a new workspaces' })
  @Post()
  create(
    @CurrentUser() user: { userId: string; email: string },
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    return this.workspacesService.create(user.userId, createWorkspaceDto);
  }

  @Get()
  @ResponseMessage('Workspace retrieved successfully')
  @ApiOperation({ summary: 'Get my workspaces' })
  findAll(@CurrentUser() user: { userId: string; email: string }) {
    return this.workspacesService.findAll(user.userId);
  }

  @Get(':id')
  @ResponseMessage('Workspace retrieved successfully')
  @ApiOperation({ summary: 'Get workspaces by ID' })
  findOne(
    @CurrentUser() user: { userId: string; email: string },
    @Param('id') id: string,
  ) {
    return this.workspacesService.findOne(user.userId, id);
  }

  @Patch(':id')
  @ResponseMessage('Workspace updated successfully')
  @ApiOperation({ summary: 'Update workspaces by ID' })
  update(
    @CurrentUser() user: { userId: string; email: string },
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.update(user.userId, id, updateWorkspaceDto);
  }

  @Delete(':id')
  @ResponseMessage('Workspace deleted successfully')
  @ApiOperation({ summary: 'Delete workspaces by ID' })
  remove(
    @CurrentUser() user: { userId: string; email: string },
    @Param('id') id: string,
  ) {
    return this.workspacesService.remove(user.userId, id);
  }
}
