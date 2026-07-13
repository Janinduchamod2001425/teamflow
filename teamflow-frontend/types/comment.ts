export interface CommentUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  taskId: string;
  userId: string;
  user: CommentUser;
}

export interface CreateCommentDto {
  content: string;
}

export type UpdateCommentDto = CreateCommentDto;
