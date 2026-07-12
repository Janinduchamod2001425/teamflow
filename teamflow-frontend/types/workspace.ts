export interface WorkspaceMemberSummary {
  id: string;
  role: "ADMIN" | "MANAGER" | "MEMBER";
  createdAt: string;
  userId: string;
  workspaceId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  members?: WorkspaceMemberSummary[];
}

export interface CreateWorkspaceDto {
  name: string;
  description: string;
}

export interface UpdateWorkspaceDto {
  name: string;
  description: string;
}
