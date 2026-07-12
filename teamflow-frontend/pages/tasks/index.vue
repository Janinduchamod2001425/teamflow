<template>
  <section class="space-y-6">
    <div
      v-if="!workspace"
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

    <template v-else>
      <div
        class="flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/70 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">
            Tasks
          </h1>
          <p class="mt-1 text-sm text-slate-500">
            <template v-if="activeProject">
              Showing tasks for
              <span class="font-medium text-slate-700">{{
                activeProject.name
              }}</span>
            </template>
            <template v-else>
              All tasks across
              <span class="font-medium text-slate-700">{{
                workspace.name
              }}</span>
            </template>
          </p>
        </div>

        <div class="flex items-center gap-3">
          <select
            v-model="selectedProjectId"
            class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700"
            @change="onProjectFilterChange"
          >
            <option value="">All Projects</option>
            <option
              v-for="p in projectStore.projects"
              :key="p.id"
              :value="p.id"
            >
              {{ p.name }}
            </option>
          </select>

          <button
            v-if="activeProject"
            class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-300"
            @click="
              editingTask = null;
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
            New Task
          </button>
        </div>
      </div>

      <!-- Kanban mode: shown when a project is selected -->
      <KanbanBoard
        v-if="activeProject"
        :board="taskStore.board"
        @delete="confirmDelete"
        @edit="editTask"
        @move="handleMove"
      />

      <!-- List mode: shown when browsing all tasks across the workspace -->
      <template v-else>
        <div
          class="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/60 p-4 backdrop-blur"
        >
          <input
            v-model="filters.keyword"
            class="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Search tasks..."
            @keyup.enter="runSearch"
          />
          <select
            v-model="filters.status"
            class="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            @change="runSearch"
          >
            <option value="">Any Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="DONE">Done</option>
          </select>
          <select
            v-model="filters.priority"
            class="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            @change="runSearch"
          >
            <option value="">Any Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
          <button
            class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            @click="runSearch"
          >
            Search
          </button>
        </div>

        <div
          class="overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <table class="w-full text-left text-sm">
            <thead
              class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"
            >
              <tr>
                <th class="px-4 py-3">Task</th>
                <th class="px-4 py-3">Project</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Priority</th>
                <th class="px-4 py-3">Assignee</th>
                <th class="px-4 py-3">Due</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="task in taskStore.searchResults"
                :key="task.id"
                class="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <td class="px-4 py-3 font-medium text-slate-800">
                  {{ task.title }}
                </td>
                <td class="px-4 py-3">
                  <button
                    class="text-indigo-600 hover:underline"
                    @click="openProjectFilter(task.projectId)"
                  >
                    {{ projectName(task.projectId) }}
                  </button>
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="statusStyles[task.status]"
                    class="rounded-full px-2 py-0.5 text-xs font-medium"
                  >
                    {{ task.status.replace("_", " ") }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="priorityStyles[task.priority]"
                    class="rounded-full px-2 py-0.5 text-xs font-medium"
                  >
                    {{ task.priority }}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-500">
                  {{ task.assignee?.name || "Unassigned" }}
                </td>
                <td class="px-4 py-3 text-slate-500">
                  {{ task.dueDate ? formatDate(task.dueDate) : "—" }}
                </td>
                <td class="px-4 py-3 text-right">
                  <button
                    class="text-xs text-slate-400 hover:text-indigo-600"
                    @click="editTask(task)"
                  >
                    Edit
                  </button>
                </td>
              </tr>

              <tr
                v-if="
                  !taskStore.searchLoading &&
                  taskStore.searchResults.length === 0
                "
              >
                <td class="px-4 py-10 text-center text-slate-400" colspan="7">
                  No tasks found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="taskStore.searchMeta.totalPages > 1"
          class="flex items-center justify-center gap-2"
        >
          <button
            :disabled="filters.page <= 1"
            class="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40"
            @click="changePage(filters.page - 1)"
          >
            Prev
          </button>
          <span class="text-sm text-slate-500"
            >Page {{ taskStore.searchMeta.page }} of
            {{ taskStore.searchMeta.totalPages }}</span
          >
          <button
            :disabled="filters.page >= taskStore.searchMeta.totalPages"
            class="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40"
            @click="changePage(filters.page + 1)"
          >
            Next
          </button>
        </div>
      </template>

      <TaskModal
        :members="workspace.members || []"
        :show="showModal"
        :task="editingTask"
        @close="
          showModal = false;
          editingTask = null;
        "
        @submit="saveTask"
      />

      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="deletingTask"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            @click.self="deletingTask = null"
          >
            <div
              class="w-full max-w-sm rounded-2xl border border-white/20 bg-white p-6 shadow-2xl"
            >
              <h2 class="text-lg font-bold text-slate-900">Delete task?</h2>
              <p class="mt-2 text-sm text-slate-500">
                This will permanently delete
                <span class="font-medium text-slate-700">{{
                  deletingTask?.title
                }}</span
                >. This can't be undone.
              </p>
              <div class="mt-6 flex justify-end gap-3">
                <button
                  class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  @click="deletingTask = null"
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
  </section>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import KanbanBoard from "~/components/task/KanbanBoard.vue";
import TaskModal from "~/components/task/TaskModal.vue";
import { TaskService } from "~/services/task.service";
import type { Task, TaskStatus } from "~/types/task";
import type { Project } from "~/types/project";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const workspaceStore = useWorkspaceStore();
const projectStore = useProjectStore();
const taskStore = useTaskStore();
const toast = useToast();

const workspace = computed(() => workspaceStore.selectedWorkspace);

const selectedProjectId = ref((route.query.projectId as string) || "");
const activeProject = computed<Project | null>(
  () =>
    projectStore.projects.find((p) => p.id === selectedProjectId.value) || null,
);

const showModal = ref(false);
const editingTask = ref<Task | null>(null);
const deletingTask = ref<Task | null>(null);
const deleteLoading = ref(false);

const filters = reactive({
  keyword: "",
  status: "",
  priority: "",
  page: 1,
  limit: 10,
});

onMounted(async () => {
  workspaceStore.initializeWorkspace();
  if (!workspace.value) return;

  await projectStore.fetchProjects(workspace.value.id);

  if (selectedProjectId.value) {
    await taskStore.fetchBoard(workspace.value.id, selectedProjectId.value);
  } else {
    await runSearch();
  }
});

watch(
  () => route.query.projectId,
  async (val) => {
    selectedProjectId.value = (val as string) || "";
    if (!workspace.value) return;

    if (selectedProjectId.value) {
      await taskStore.fetchBoard(workspace.value.id, selectedProjectId.value);
    } else {
      await runSearch();
    }
  },
);

function onProjectFilterChange() {
  router.push({
    path: "/tasks",
    query: selectedProjectId.value
      ? { projectId: selectedProjectId.value }
      : {},
  });
}

function openProjectFilter(projectId: string) {
  selectedProjectId.value = projectId;
  router.push({ path: "/tasks", query: { projectId } });
}

function projectName(projectId: string) {
  return projectStore.projects.find((p) => p.id === projectId)?.name || "—";
}

async function runSearch() {
  if (!workspace.value) return;
  await taskStore.fetchSearch(workspace.value.id, {
    keyword: filters.keyword || undefined,
    status: (filters.status || undefined) as TaskStatus | undefined,
    priority: (filters.priority || undefined) as any,
    page: filters.page,
    limit: filters.limit,
  });
}

function changePage(page: number) {
  filters.page = page;
  runSearch();
}

async function saveTask(data: any) {
  if (!workspace.value) return;

  try {
    if (editingTask.value) {
      await TaskService.update(workspace.value.id, editingTask.value.id, data);
      toast.success("Task updated successfully");

      if (activeProject.value) {
        await taskStore.fetchBoard(workspace.value.id, activeProject.value.id);
      } else {
        await runSearch();
      }
    } else {
      if (!activeProject.value) return;
      await taskStore.createTask(
        workspace.value.id,
        activeProject.value.id,
        data,
      );
      toast.success("Task created successfully");
    }
    editingTask.value = null;
    showModal.value = false;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Something went wrong");
  }
}

function editTask(task: Task) {
  editingTask.value = task;
  showModal.value = true;
}

function confirmDelete(task: Task) {
  deletingTask.value = task;
}

async function performDelete() {
  if (!workspace.value || !deletingTask.value) return;

  deleteLoading.value = true;
  try {
    if (activeProject.value) {
      await taskStore.deleteTask(
        workspace.value.id,
        activeProject.value.id,
        deletingTask.value.id,
      );
    } else {
      await TaskService.remove(workspace.value.id, deletingTask.value.id);
      await runSearch();
    }
    toast.success("Task deleted");
    deletingTask.value = null;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to delete task");
  } finally {
    deleteLoading.value = false;
  }
}

async function handleMove(task: Task, status: TaskStatus) {
  if (!workspace.value || !activeProject.value) return;
  try {
    await taskStore.moveTask(
      workspace.value.id,
      activeProject.value.id,
      task.id,
      status,
    );
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to update task status");
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

const statusStyles: Record<string, string> = {
  TODO: "bg-slate-100 text-slate-600",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  REVIEW: "bg-purple-100 text-purple-700",
  DONE: "bg-emerald-100 text-emerald-700",
};

const priorityStyles: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-amber-100 text-amber-700",
  URGENT: "bg-red-100 text-red-700",
};
</script>
