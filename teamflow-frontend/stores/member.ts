import { defineStore } from "pinia";
import { ref } from "vue";
import { MemberService } from "~/services/member.service";
import type { WorkspaceMember, Role } from "~/types/member";

export const useMemberStore = defineStore("member", () => {
  const members = ref<WorkspaceMember[]>([]);
  const loading = ref(false);

  async function fetchMembers(workspaceId: string) {
    loading.value = true;
    try {
      const response = await MemberService.findAll(workspaceId);
      members.value = response.data.data;
    } finally {
      loading.value = false;
    }
  }

  async function inviteMember(workspaceId: string, email: string, role: Role) {
    await MemberService.invite(workspaceId, { email, role });
    await fetchMembers(workspaceId);
  }

  async function updateRole(workspaceId: string, memberId: string, role: Role) {
    await MemberService.updateRole(workspaceId, memberId, role);
    await fetchMembers(workspaceId);
  }

  async function removeMember(workspaceId: string, memberId: string) {
    await MemberService.remove(workspaceId, memberId);
    members.value = members.value.filter((m) => m.id !== memberId);
  }

  function reset() {
    members.value = [];
  }

  return {
    members,
    loading,
    fetchMembers,
    inviteMember,
    updateRole,
    removeMember,
    reset,
  };
});
