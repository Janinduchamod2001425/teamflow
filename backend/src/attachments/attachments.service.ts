import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkspaceAccessService } from '../workspace-access/workspace-access.service';

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

  async upload(
    userId: string,
    workspaceId: string,
    taskId: string,
    file: Express.Multer.File,
  ) {
    await this.workspaceAccessService.requireMember(userId, workspaceId);
    await this.ensureTaskBelongsToWorkspace(taskId, workspaceId);

    return this.prisma.attachment.create({
      data: {
        originalName: file.originalname,
        fileName: file.filename,
        filePath: file.path,
        mimeType: file.mimetype,
        size: file.size,
        taskId,
        uploadedBy: userId,
      },
    });
  }

  async findAll(userId: string, workspaceId: string, taskId: string) {
    await this.workspaceAccessService.requireMember(userId, workspaceId);
    await this.ensureTaskBelongsToWorkspace(taskId, workspaceId);

    return this.prisma.attachment.findMany({
      where: { taskId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(
    userId: string,
    workspaceId: string,
    taskId: string,
    attachmentId: string,
  ) {
    await this.workspaceAccessService.requireMember(userId, workspaceId);
    await this.ensureTaskBelongsToWorkspace(taskId, workspaceId);

    const attachment = await this.prisma.attachment.findFirst({
      where: {
        id: attachmentId,
        taskId,
      },
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    await this.prisma.attachment.delete({
      where: { id: attachmentId },
    });

    return null;
  }

  private async ensureTaskBelongsToWorkspace(
    taskId: string,
    workspaceId: string,
  ) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
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
}
