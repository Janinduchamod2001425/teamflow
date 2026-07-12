import { defineStore } from "pinia";
import { ref } from "vue";
import { InvitationService } from "~/services/invitation.service";
import type { Invitation } from "~/types/invitation";

export const useInvitationStore = defineStore("invitation", () => {
  const invitations = ref<Invitation[]>([]);
  const loading = ref(false);

  async function fetchMine() {
    loading.value = true;
    try {
      const response = await InvitationService.findMine();
      invitations.value = response.data.data;
    } finally {
      loading.value = false;
    }
  }

  async function accept(invitationId: string) {
    await InvitationService.respond(invitationId, "ACCEPTED");
    invitations.value = invitations.value.filter((i) => i.id !== invitationId);
  }

  async function decline(invitationId: string) {
    await InvitationService.respond(invitationId, "DECLINED");
    invitations.value = invitations.value.filter((i) => i.id !== invitationId);
  }

  function reset() {
    invitations.value = [];
  }

  return { invitations, loading, fetchMine, accept, decline, reset };
});
