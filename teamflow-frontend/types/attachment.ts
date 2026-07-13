export interface Attachment {
  id: string;
  originalName: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  size: number;
  createdAt: string;
  taskId: string;
  uploadedBy: string;
}
