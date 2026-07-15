<template>
  <section class="space-y-6">
    <!-- Loading workspace spinner -->
    <div
      v-if="loadingWorkspace"
      class="flex min-h-[60vh] items-center justify-center"
    >
      <div class="flex flex-col items-center space-y-4">
        <div class="relative">
          <div
            class="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"
          ></div>
        </div>
        <p class="text-sm font-medium text-slate-500 animate-pulse">
          Loading Members...
        </p>
      </div>
    </div>

    <!-- No workspace selected -->
    <div
      v-else-if="!workspace"
      class="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-10 text-center"
    >
      <p class="text-slate-600">Select a workspace first.</p>
      <NuxtLink
        class="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        to="/workspaces"
      >
        Go to Workspaces
      </NuxtLink>
    </div>

    <!-- Workspace content -->
    <template v-else>
      <LayoutBreadcrumb
        :items="[
          { label: workspace.name, to: '/dashboard' },
          { label: 'Members' },
        ]"
      />

      <div
        class="flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/70 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">
            Members
          </h1>
          <p class="mt-1 text-sm text-slate-500">
            {{ memberStore.members.length }} member{{
              memberStore.members.length === 1 ? "" : "s"
            }}
            in
            <span class="font-medium text-slate-700">{{ workspace.name }}</span>
          </p>
        </div>

        <button
          v-if="canManage"
          class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-300"
          @click="showInviteModal = true"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 4v16m8-8H4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
          Invite Member
        </button>
      </div>

      <MemberList
        :can-manage="canManage"
        :current-user-id="authStore.user?.id"
        :members="memberStore.members"
        @remove="confirmRemove"
        @change-role="handleRoleChange"
      />

      <InviteMemberModal
        :loading="inviteLoading"
        :show="showInviteModal"
        @close="showInviteModal = false"
        @submit="handleInvite"
      />

      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="removingMember"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            @click.self="removingMember = null"
          >
            <div
              class="w-full max-w-sm rounded-2xl border border-white/20 bg-white p-6 shadow-2xl"
            >
              <h2 class="text-lg font-bold text-slate-900">
                {{ isPending ? "Cancel invitation?" : "Remove member?" }}
              </h2>
              <p class="mt-2 text-sm text-slate-500">
                <template v-if="isPending">
                  The invitation sent to
                  <span class="font-medium text-slate-700">{{
                    removingMember?.user.email
                  }}</span>
                  will be withdrawn, and they'll be notified it was cancelled.
                </template>
                <template v-else>
                  <span class="font-medium text-slate-700">{{
                    removingMember?.user.name
                  }}</span>
                  will lose access to this workspace immediately.
                </template>
              </p>
              <div class="mt-6 flex justify-end gap-3">
                <button
                  class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  @click="removingMember = null"
                >
                  Cancel
                </button>
                <button
                  :disabled="removeLoading"
                  class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                  @click="performRemove"
                >
                  {{
                    removeLoading
                      ? "Working..."
                      : isPending
                        ? "Cancel Invite"
                        : "Remove"
                  }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </template>
  </section>
</template>

<script lang="ts" setup>
import MemberList from "~/components/member/MemberList.vue";
import InviteMemberModal from "~/components/member/InviteMemberModal.vue";
import type { WorkspaceMember, Role } from "~/types/member";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const workspaceStore = useWorkspaceStore();
const memberStore = useMemberStore();
const authStore = useAuthStore();
const toast = useToast();

const workspace = computed(() => workspaceStore.selectedWorkspace);
const loadingWorkspace = ref(true); // ✅ added

const canManage = computed(() => {
  const uid = authStore.user?.id;
  const me = memberStore.members.find((m) => m.user.id === uid);
  return me?.role === "ADMIN";
});

const showInviteModal = ref(false);
const inviteLoading = ref(false);
const removingMember = ref<WorkspaceMember | null>(null);
const removeLoading = ref(false);

const route = useRoute();

const isPending = computed(() => removingMember.value?.status === "PENDING");

onMounted(async () => {
  loadingWorkspace.value = true;
  await workspaceStore.initializeWorkspace();
  loadingWorkspace.value = false;

  if (workspace.value) {
    await memberStore.fetchMembers(workspace.value.id);
  }

  if (route.query.action === "invite" && canManage.value) {
    showInviteModal.value = true;
  }
});

watch(workspace, async (ws) => {
  if (ws) {
    await memberStore.fetchMembers(ws.id);
  } else {
    memberStore.reset();
  }
});

async function handleInvite(payload: { email: string; role: Role }) {
  if (!workspace.value) return;

  inviteLoading.value = true;
  try {
    await memberStore.inviteMember(
      workspace.value.id,
      payload.email,
      payload.role,
    );
    toast.success(`Invited ${payload.email} as ${payload.role.toLowerCase()}`);
    showInviteModal.value = false;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to invite member");
  } finally {
    inviteLoading.value = false;
  }
}

async function handleRoleChange(member: WorkspaceMember, role: string) {
  if (!workspace.value) return;

  try {
    await memberStore.updateRole(workspace.value.id, member.id, role as Role);
    toast.success(
      `${member.user.name}'s role updated to ${role.toLowerCase()}`,
    );
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to update role");
  }
}

function confirmRemove(member: WorkspaceMember) {
  removingMember.value = member;
}

async function performRemove() {
  if (!workspace.value || !removingMember.value) return;

  const wasPending = removingMember.value.status === "PENDING";

  removeLoading.value = true;
  try {
    await memberStore.removeMember(workspace.value.id, removingMember.value.id);
    toast.success(wasPending ? "Invitation cancelled" : "Member removed");
    removingMember.value = null;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to remove member");
  } finally {
    removeLoading.value = false;
  }
}
</script>
