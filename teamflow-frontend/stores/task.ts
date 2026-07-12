import { defineStore } from "pinia";
import { ref } from "vue";
import { TaskService } from "~/services/task.service";
import type {
  Task,
  TaskBoard,
  CreateTaskDto,
  UpdateTaskDto,
  TaskStatus,
  TaskSearchParams,
  TaskSearchResult,
} from "~/types/task";

const emptyBoard = (): TaskBoard => ({
  TODO: [],
  IN_PROGRESS: [],
  REVIEW: [],
  DONE: [],
});

export const useTaskStore = defineStore("task", () => {
  const board = ref<TaskBoard>(emptyBoard());
  const loading = ref(false);

  const searchResults = ref<Task[]>([]);
  const searchMeta = ref({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const searchLoading = ref(false);

  async function fetchSearch(workspaceId: string, params: TaskSearchParams) {
    searchLoading.value = true;
    try {
      const response = await TaskService.search(workspaceId, params);
      const result: TaskSearchResult = response.data.data;
      searchResults.value = result.items;
      searchMeta.value = result.meta;
    } finally {
      searchLoading.value = false;
    }
  }

  async function fetchBoard(workspaceId: string, projectId: string) {
    loading.value = true;
    try {
      const response = await TaskService.getBoard(workspaceId, projectId);
      board.value = response.data.data;
    } finally {
      loading.value = false;
    }
  }

  async function createTask(
    workspaceId: string,
    projectId: string,
    data: Omit<CreateTaskDto, "projectId">,
  ) {
    await TaskService.create(workspaceId, { ...data, projectId });
    await fetchBoard(workspaceId, projectId);
  }

  async function updateTask(
    workspaceId: string,
    projectId: string,
    taskId: string,
    data: UpdateTaskDto,
  ) {
    await TaskService.update(workspaceId, taskId, data);
    await fetchBoard(workspaceId, projectId);
  }

  async function moveTask(
    workspaceId: string,
    projectId: string,
    taskId: string,
    status: TaskStatus,
  ) {
    let moved: Task | undefined;

    for (const key of Object.keys(board.value) as TaskStatus[]) {
      const idx = board.value[key].findIndex((t) => t.id === taskId);
      if (idx !== -1) {
        moved = board.value[key][idx];
        board.value[key].splice(idx, 1);
        break;
      }
    }

    if (moved) {
      moved.status = status;
      board.value[status].unshift(moved);
    }

    try {
      await TaskService.updateStatus(workspaceId, taskId, status);
    } catch (err) {
      await fetchBoard(workspaceId, projectId);
      throw err;
    }
  }

  async function deleteTask(
    workspaceId: string,
    projectId: string,
    taskId: string,
  ) {
    await TaskService.remove(workspaceId, taskId);
    await fetchBoard(workspaceId, projectId);
  }

  function reset() {
    board.value = emptyBoard();
  }

  return {
    board,
    loading,
    fetchBoard,
    createTask,
    updateTask,
    moveTask,
    deleteTask,
    reset,
  };
});
