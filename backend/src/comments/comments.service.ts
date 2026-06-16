import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkspaceAccessService } from '../workspace-access/workspace-access.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ActivitiesService } from '../activities/activities.service';
import { ActivityAction } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceAccessService: WorkspaceAccessService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  async create(
    userId: string,
    workspaceId: string,
    projectId: string,
    taskId: string,
    createCommentDto: CreateCommentDto,
  ) {
    await this.workspaceAccessService.requireMember(userId, workspaceId);

    await this.ensureTaskBelongsToProject(workspaceId, projectId, taskId);

    const comment = await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        taskId,
        userId,
      },
      include: this.commentInclude(),
    });

    await this.activitiesService.createActivity({
      workspaceId,
      userId,
      action: ActivityAction.COMMENT_CREATED,
      description: 'Added a comment to a task',
      metadata: {
        commentId: comment.id,
        taskId,
        projectId,
      },
    });

    return comment;
  }

  async findAll(
    userId: string,
    workspaceId: string,
    projectId: string,
    taskId: string,
  ) {
    await this.workspaceAccessService.requireMember(userId, workspaceId);

    await this.ensureTaskBelongsToProject(workspaceId, projectId, taskId);

    return this.prisma.comment.findMany({
      where: {
        taskId,
      },
      include: this.commentInclude(),
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async update(
    userId: string,
    workspaceId: string,
    projectId: string,
    taskId: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    await this.workspaceAccessService.requireMember(userId, workspaceId);

    await this.ensureTaskBelongsToProject(workspaceId, projectId, taskId);

    const comment = await this.findComment(taskId, commentId);

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only update your own comment');
    }

    const updatedComment = await this.prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: updateCommentDto.content,
      },
      include: this.commentInclude(),
    });

    await this.activitiesService.createActivity({
      workspaceId,
      userId,
      action: ActivityAction.COMMENT_UPDATED,
      description: 'Updated a comment',
      metadata: {
        commentId: updatedComment.id,
        taskId,
        projectId,
      },
    });

    return updatedComment;
  }

  async remove(
    userId: string,
    workspaceId: string,
    projectId: string,
    taskId: string,
    commentId: string,
  ) {
    await this.workspaceAccessService.requireMember(userId, workspaceId);

    await this.ensureTaskBelongsToProject(workspaceId, projectId, taskId);

    const comment = await this.findComment(taskId, commentId);

    const member = await this.workspaceAccessService.requireMember(
      userId,
      workspaceId,
    );

    const canDelete =
      comment.userId === userId ||
      member.role === 'ADMIN' ||
      member.role === 'MANAGER';

    if (!canDelete) {
      throw new ForbiddenException(
        'You do not have permission to delete this comment',
      );
    }

    await this.activitiesService.createActivity({
      workspaceId,
      userId,
      action: ActivityAction.COMMENT_DELETED,
      description: 'Deleted a comment',
      metadata: {
        commentId: comment.id,
        taskId,
        projectId,
      },
    });

    return null;
  }

  private async ensureTaskBelongsToProject(
    workspaceId: string,
    projectId: string,
    taskId: string,
  ) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
        project: {
          workspaceId,
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  private async findComment(taskId: string, commentId: string) {
    const comment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        taskId,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  private commentInclude() {
    return {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    };
  }
}
