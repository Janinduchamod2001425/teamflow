import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { WorkspaceMembersModule } from './workspace-members/workspace-members.module';
import { WorkspaceAccessModule } from './workspace-access/workspace-access.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { ActivitiesModule } from './activities/activities.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { CacheModule } from './cache/cache.module';
import { InvitationsModule } from './invitations/invitations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    HealthModule,
    UsersModule,
    AuthModule,
    WorkspacesModule,
    WorkspaceMembersModule,
    WorkspaceAccessModule,
    ProjectsModule,
    TasksModule,
    CommentsModule,
    ActivitiesModule,
    NotificationsModule,
    DashboardModule,
    AttachmentsModule,
    CacheModule,
    InvitationsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
