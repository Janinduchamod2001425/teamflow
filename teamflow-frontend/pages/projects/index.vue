<template>
  <div class="space-y-8">
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
          Loading Projects...
        </p>
      </div>
    </div>

    <!-- No workspace selected -->
    <div
      v-else-if="!workspace"
      class="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-10 text-center"
    >
      <p class="text-slate-600">
        Select a workspace first to see its projects.
      </p>
      <NuxtLink
        class="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        to="/workspaces"
      >
        Go to Workspaces
      </NuxtLink>
    </div>

    <!-- Workspace content -->
    <template v-else>
      <!-- Breadcrumb -->
      <LayoutBreadcrumb
        :items="[
          { label: workspace.name, to: '/dashboard' },
          { label: 'Projects' },
        ]"
      />

      <div
        class="fade-in-up flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/70 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">
            Projects
          </h1>
          <p class="mt-1 text-sm text-slate-500">
            Projects in <span class="font-medium">{{ workspace.name }}</span>
          </p>
        </div>

        <button
          v-if="workspaceStore.isManagerOrAbove"
          class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-300"
          @click="
            editingProject = null;
            showModal = true;
          "
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
          New Project
        </button>
      </div>

      <div
        v-if="!projectStore.loading && projectStore.projects.length === 0"
        class="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center"
      >
        <FolderOpen class="mx-auto h-12 w-12 text-slate-300" />
        <h3 class="mt-4 text-lg font-semibold text-slate-700">
          No projects yet
        </h3>
        <p class="mt-2 text-sm text-slate-500">
          Get started by creating your first project.
        </p>
      </div>

      <ProjectList
        :can-manage="workspaceStore.isManagerOrAbove"
        :projects="projectStore.projects"
        @delete="confirmDelete"
        @edit="editProject"
        @open="openProject"
      />

      <ProjectModal
        :project="editingProject"
        :show="showModal"
        @close="
          showModal = false;
          editingProject = null;
        "
        @submit="saveProject"
      />

      <!-- Delete confirmation modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="deletingProject"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            @click.self="deletingProject = null"
          >
            <div
              class="w-full max-w-sm rounded-2xl border border-white/20 bg-white p-6 shadow-2xl"
            >
              <h2 class="text-lg font-bold text-slate-900">Delete project?</h2>
              <p class="mt-2 text-sm text-slate-500">
                This will permanently delete
                <span class="font-medium text-slate-700">{{
                  deletingProject.name
                }}</span>
                and all of its tasks. This can't be undone.
              </p>

              <div class="mt-6 flex justify-end gap-3">
                <button
                  class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  @click="deletingProject = null"
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
    </template>
  </div>
</template>

<script lang="ts" setup>
import ProjectList from "~/components/project/ProjectList.vue";
import ProjectModal from "~/components/project/ProjectModal.vue";
import type { Project, CreateProjectDto } from "~/types/project";

import { FolderOpen } from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const workspaceStore = useWorkspaceStore();
const projectStore = useProjectStore();
const toast = useToast();

const workspace = computed(() => workspaceStore.selectedWorkspace);
const loadingWorkspace = ref(true); // Start true to show spinner

const showModal = ref(false);
const editingProject = ref<Project | null>(null);
const deletingProject = ref<Project | null>(null);
const deleteLoading = ref(false);

const route = useRoute();

onMounted(async () => {
  loadingWorkspace.value = true;
  await workspaceStore.initializeWorkspace();
  // If you need to fetch workspaces separately, do it here, but initializeWorkspace likely does it.
  // If not, uncomment:
  // await workspaceStore.fetchWorkspaces();
  loadingWorkspace.value = false;

  // Check for query param after workspace is loaded
  if (route.query.action === "new" && workspaceStore.isManagerOrAbove) {
    editingProject.value = null;
    showModal.value = true;
  }
});

// Refetch projects when workspace changes (after loading)
watch(workspace, async (ws) => {
  // Only fetch if we're not in loading state and workspace exists
  if (!loadingWorkspace.value && ws) {
    await projectStore.fetchProjects(ws.id);
  } else if (!ws) {
    projectStore.reset();
  }
});

// Also trigger initial fetch when workspace becomes available after loading
// We'll use a separate watch to handle the first load after loadingWorkspace becomes false
// But we can also call fetchProjects in onMounted after loadingWorkspace is false.
// For simplicity, we'll add a watcher that triggers when loadingWorkspace becomes false and workspace is set.
// However, the above watch will run when workspace changes, but initially workspace might be set before loadingWorkspace becomes false?
// Better to handle explicitly:
// We can use an immediate watcher or call fetch in onMounted after loading.
// Let's add an onMounted that fetches after loadingWorkspace is false.
// Actually we already have loadingWorkspace set false in onMounted; we can fetch there.

// Update: we'll move the fetch to after loadingWorkspace is false in onMounted.
// But we also need to handle when workspace changes later.

// Let's refactor: we'll have a function loadProjects() that we call when workspace is ready.
async function loadProjects() {
  if (workspace.value) {
    await projectStore.fetchProjects(workspace.value.id);
  } else {
    projectStore.reset();
  }
}

// In onMounted, after loadingWorkspace false, call loadProjects.
// Also watch for workspace changes to reload.

// We'll adjust accordingly.

// We'll keep the original onMounted and add the call.
// But we must be careful not to double-fetch.

// Let's rewrite:

onMounted(async () => {
  loadingWorkspace.value = true;
  await workspaceStore.initializeWorkspace();
  // If you need to fetch workspaces list, uncomment:
  // await workspaceStore.fetchWorkspaces();
  loadingWorkspace.value = false;

  // Load projects if workspace exists
  if (workspace.value) {
    await projectStore.fetchProjects(workspace.value.id);
  }

  // Handle query param
  if (route.query.action === "new" && workspaceStore.isManagerOrAbove) {
    editingProject.value = null;
    showModal.value = true;
  }
});

// Watch for workspace changes (e.g., user switches workspace from another page)
watch(workspace, async (ws) => {
  if (ws) {
    await projectStore.fetchProjects(ws.id);
  } else {
    projectStore.reset();
  }
});

async function saveProject(data: CreateProjectDto) {
  if (!workspace.value) return;

  try {
    if (editingProject.value) {
      await projectStore.updateProject(
        workspace.value.id,
        editingProject.value.id,
        data,
      );
      toast.success("Project updated successfully");
    } else {
      await projectStore.createProject(workspace.value.id, data);
      toast.success("Project created successfully");
    }
    editingProject.value = null;
    showModal.value = false;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Something went wrong");
  }
}

function editProject(project: Project) {
  editingProject.value = project;
  showModal.value = true;
}

function confirmDelete(project: Project) {
  deletingProject.value = project;
}

async function performDelete() {
  if (!workspace.value || !deletingProject.value) return;

  deleteLoading.value = true;
  try {
    await projectStore.deleteProject(
      workspace.value.id,
      deletingProject.value.id,
    );
    toast.success("Project deleted");
    deletingProject.value = null;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to delete project");
  } finally {
    deleteLoading.value = false;
  }
}

function openProject(project: Project) {
  navigateTo(`/tasks?projectId=${project.id}`);
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
