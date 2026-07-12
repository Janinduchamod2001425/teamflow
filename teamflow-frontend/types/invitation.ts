export type MembershipStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface Invitation {
  id: string;
  role: "ADMIN" | "MANAGER" | "MEMBER";
  status: MembershipStatus;
  createdAt: string;
  userId: string;
  workspaceId: string;
  workspace: {
    id: string;
    name: string;
    description: string | null;
  };
}
