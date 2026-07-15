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

    <!-- Invitation cards -->
    <div
      v-if="
        invitationStore.invitations.length === 0 && !invitationStore.loading
      "
      class="relative rounded-2xl border border-dashed border-slate-200 bg-white/60 p-16 text-center backdrop-blur-sm"
    >
      <Inbox class="mx-auto h-12 w-12 text-slate-300" />
      <h3 class="mt-4 text-lg font-semibold text-slate-700">
        No pending invitations
      </h3>
      <p class="mt-1 text-sm text-slate-500">
        You're all set! Check back later for new invitations.
      </p>
    </div>

    <div v-else class="relative grid gap-4 md:grid-cols-2">
      <div
        v-for="invite in invitationStore.invitations"
        :key="invite.id"
        class="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="flex items-start gap-4">
          <!-- Workspace avatar -->
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-base font-bold text-indigo-700"
          >
            {{ invite.workspace.name.charAt(0).toUpperCase() }}
          </div>

          <div class="flex-1 min-w-0">
            <h2 class="text-lg font-semibold text-slate-900 truncate">
              {{ invite.workspace.name }}
            </h2>
            <div
              class="flex flex-wrap items-center gap-2 text-sm text-slate-500"
            >
              <span>Invited as</span>
              <span
                class="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700"
              >
                {{ invite.role.toLowerCase() }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="mt-5 flex gap-3">
          <button
            :disabled="processingId === invite.id"
            class="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:shadow-lg hover:shadow-indigo-300 disabled:opacity-60"
            @click="handleAccept(invite)"
          >
            <span
              v-if="processingId === invite.id"
              class="flex items-center justify-center gap-2"
            >
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  fill="none"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                  fill="currentColor"
                />
              </svg>
              Accepting...
            </span>
            <span v-else>Accept</span>
          </button>
          <button
            :disabled="processingId === invite.id"
            class="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-60"
            @click="handleDecline(invite)"
          >
            <span
              v-if="processingId === invite.id"
              class="flex items-center justify-center gap-2"
            >
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  fill="none"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                  fill="currentColor"
                />
              </svg>
              Declining...
            </span>
            <span v-else>Decline</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { Invitation } from "~/types/invitation";
import { Mail, Inbox } from "lucide-vue-next";

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
