import { api } from "./api";
import type { InviteMemberDto, Role } from "~/types/member";

export const MemberService = {
  findAll(workspaceId: string) {
    return api.get(`/workspaces/${workspaceId}/members`);
  },

  invite(workspaceId: string, data: InviteMemberDto) {
    return api.post(`/workspaces/${workspaceId}/members`, data);
  },

  updateRole(workspaceId: string, memberId: string, role: Role) {
    return api.patch(`/workspaces/${workspaceId}/members/${memberId}/role`, {
      role,
    });
  },

  remove(workspaceId: string, memberId: string) {
    return api.delete(`/workspaces/${workspaceId}/members/${memberId}`);
  },
};
