<template>
  <section class="space-y-6">
    <div
      class="rounded-3xl border border-white/20 bg-white/70 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-xl"
    >
      <h1 class="text-3xl font-bold tracking-tight text-slate-900">
        Invitations
      </h1>
      <p class="mt-1 text-sm text-slate-500">
        Workspaces waiting for your response.
      </p>
    </div>

    <div
      v-if="
        invitationStore.invitations.length === 0 && !invitationStore.loading
      "
      class="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-10 text-center text-slate-400"
    >
      No pending invitations.
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div
        v-for="invite in invitationStore.invitations"
        :key="invite.id"
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div class="flex items-start gap-3">
          <div
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700"
          >
            {{ invite.workspace.name.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1">
            <h2 class="font-semibold text-slate-900">
              {{ invite.workspace.name }}
            </h2>
            <p class="text-sm text-slate-500">
              Invited as
              <span class="font-medium text-slate-700">{{
                invite.role.toLowerCase()
              }}</span>
            </p>
          </div>
        </div>

        <div class="mt-5 flex gap-3">
          <button
            :disabled="processingId === invite.id"
            class="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            @click="handleAccept(invite)"
          >
            Accept
          </button>
          <button
            :disabled="processingId === invite.id"
            class="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
            @click="handleDecline(invite)"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { Invitation } from "~/types/invitation";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const invitationStore = useInvitationStore();
const workspaceStore = useWorkspaceStore();
const toast = useToast();

const processingId = ref<string | null>(null);

onMounted(async () => {
  await invitationStore.fetchMine();
});

async function handleAccept(invite: Invitation) {
  processingId.value = invite.id;
  try {
    await invitationStore.accept(invite.id);
    toast.success(`Joined ${invite.workspace.name}`);
    await workspaceStore.fetchWorkspaces();
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to accept invitation");
  } finally {
    processingId.value = null;
  }
}

async function handleDecline(invite: Invitation) {
  processingId.value = invite.id;
  try {
    await invitationStore.decline(invite.id);
    toast.info(`Declined invitation to ${invite.workspace.name}`);
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to decline invitation");
  } finally {
    processingId.value = null;
  }
}
</script>
