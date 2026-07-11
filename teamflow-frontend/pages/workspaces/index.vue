<template>
  <div class="space-y-8">
    <!-- Header with glass panel + fade‑in animation -->
    <div
      class="fade-in-up flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/70 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">
          Workspaces
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Manage your team's workspaces.
        </p>
      </div>

      <button
        class="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-300"
        @click="
          editingWorkspace = null;
          showModal = true;
        "
      >
        <span
          class="absolute inset-0 bg-white/10 transition-opacity group-hover:opacity-0"
        />
        <svg
          class="relative h-4 w-4"
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
        <span class="relative">New Workspace</span>
      </button>
    </div>

    <!-- Workspace list with staggered animation (handled inside WorkspaceList) -->
    <WorkspaceList
      :workspaces="workspaceStore.workspaces"
      @delete="confirmDelete"
      @edit="editWorkspace"
      @open="openWorkspace"
    />

    <!-- Delete confirmation modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="deletingWorkspace"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          @click.self="deletingWorkspace = null"
        >
          <div
            class="w-full max-w-sm rounded-2xl border border-white/20 bg-white p-6 shadow-2xl"
          >
            <h2 class="text-lg font-bold text-slate-900">Delete workspace?</h2>
            <p class="mt-2 text-sm text-slate-500">
              This will permanently delete
              <span class="font-medium text-slate-700">{{
                deletingWorkspace?.name
              }}</span>
              and everything inside it. This can't be undone.
            </p>

            <div class="mt-6 flex justify-end gap-3">
              <button
                class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                @click="deletingWorkspace = null"
              >
                Cancel
              </button>
              <button
                :disabled="deleteLoading"
                class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                @click="performDelete"
              >
                {{ deleteLoading ? "Deleting..." : "Delete" }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Glass modal -->
    <WorkspaceModal
      :show="showModal"
      :workspace="editingWorkspace"
      @close="
        showModal = false;
        editingWorkspace = null;
      "
      @submit="saveWorkspace"
    />
  </div>
</template>

<script lang="ts" setup>
import WorkspaceList from "~/components/workspace/WorkspaceList.vue";
import WorkspaceModal from "~/components/workspace/WorkspaceModal.vue";
import type { Workspace, CreateWorkspaceDto } from "~/types/workspace";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const workspaceStore = useWorkspaceStore();
const showModal = ref(false);

const editingWorkspace = ref<Workspace | null>(null);

const deletingWorkspace = ref<Workspace | null>(null);
const deleteLoading = ref(false);

const toast = useToast();

function confirmDelete(workspace: Workspace) {
  deletingWorkspace.value = workspace;
}

async function performDelete() {
  if (!deletingWorkspace.value) return;
  deleteLoading.value = true;
  try {
    await workspaceStore.deleteWorkspace(deletingWorkspace.value.id);
    toast.success("Workspace deleted");
    deletingWorkspace.value = null;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to delete workspace");
  } finally {
    deleteLoading.value = false;
  }
}

onMounted(async () => {
  workspaceStore.initializeWorkspace();
  await workspaceStore.fetchWorkspaces();
});

async function saveWorkspace(data: CreateWorkspaceDto) {
  try {
    if (editingWorkspace.value) {
      await workspaceStore.updateWorkspace(editingWorkspace.value.id, data);
      toast.success("Workspace updated successfully");
    } else {
      await workspaceStore.createWorkspace(data);
      toast.success("Workspace created successfully");
    }
    editingWorkspace.value = null;
    showModal.value = false;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Something went wrong");
  }
}

function editWorkspace(workspace: Workspace) {
  editingWorkspace.value = workspace;
  showModal.value = true;
}

function openWorkspace(workspace: Workspace) {
  workspaceStore.selectWorkspace(workspace);
  navigateTo("/dashboard");
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-in-up {
  animation: fadeInUp 0.5s ease-out both;
}
</style>
