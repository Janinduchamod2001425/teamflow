export interface NotificationMetadata {
  taskId?: string;
  projectId?: string;
  workspaceId?: string;
  invitationId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  metadata: NotificationMetadata | null; // <-- new field
  isRead: boolean;
  createdAt: string;
  userId: string;
}
