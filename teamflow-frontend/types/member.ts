export type Role = "ADMIN" | "MANAGER" | "MEMBER";

export interface WorkspaceMember {
  id: string;
  role: Role;
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

export interface InviteMemberDto {
  email: string;
  role: Role;
}
