import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  sendToWorkspace(workspaceId: string, event: string, payload: any) {
    this.notificationsGateway.emitToWorkspace(workspaceId, event, payload);
  }
}
