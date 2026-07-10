import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('user.join')
  handleJoinUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: string },
  ) {
    const room = this.getUserRoom(payload.userId);
    client.join(room);

    client.emit('user.joined', {
      userId: payload.userId,
      room,
    });
  }

  @SubscribeMessage('workspaces.join')
  handleJoinWorkspace(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { workspaceId: string },
  ) {
    const room = this.getWorkspaceRoom(payload.workspaceId);
    client.join(room);

    client.emit('workspaces.joined', {
      workspaceId: payload.workspaceId,
      room,
    });
  }

  @SubscribeMessage('workspaces.leave')
  handleLeaveWorkspace(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { workspaceId: string },
  ) {
    const room = this.getWorkspaceRoom(payload.workspaceId);
    client.leave(room);

    client.emit('workspaces.left', {
      workspaceId: payload.workspaceId,
      room,
    });
  }

  emitToWorkspace(workspaceId: string, event: string, data: any) {
    const room = this.getWorkspaceRoom(workspaceId);
    this.server.to(room).emit(event, data);
  }

  emitToUser(userId: string, event: string, data: any) {
    const room = this.getUserRoom(userId);
    this.server.to(room).emit(event, data);
  }

  private getWorkspaceRoom(workspaceId: string) {
    return `workspace:${workspaceId}`;
  }

  private getUserRoom(userId: string) {
    return `user:${userId}`;
  }
}
