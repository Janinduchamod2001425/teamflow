<template>
  <div class="space-y-8">
    <LayoutBreadcrumb
      :items="[
        { label: workspace.name, to: '/dashboard' },
        { label: 'Projects' },
      ]"
    />
    <div
      v-if="!workspace"
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

    <template v-else>
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

      <p
        v-if="!projectStore.loading && projectStore.projects.length === 0"
        class="text-sm text-slate-500"
      >
        No projects yet. Create your first one to get started.
      </p>

      <ProjectList
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

      <!-- Delete confirmation -->
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
                  deletingProject?.name
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

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const workspaceStore = useWorkspaceStore();
const projectStore = useProjectStore();
const toast = useToast();

const workspace = computed(() => workspaceStore.selectedWorkspace);

const showModal = ref(false);
const editingProject = ref<Project | null>(null);
const deletingProject = ref<Project | null>(null);
const deleteLoading = ref(false);

onMounted(async () => {
  workspaceStore.initializeWorkspace();
  if (workspace.value) {
    await projectStore.fetchProjects(workspace.value.id);
  }
});

// Refetch if the selected workspace changes (e.g. user switches workspace elsewhere)
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
