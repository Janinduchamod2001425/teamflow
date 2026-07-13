<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        @click.self="$emit('close')"
      >
        <div
          class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/20 bg-white p-8 shadow-2xl shadow-black/5 backdrop-blur-xl"
        >
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-slate-900">
              {{ task ? "Edit Task" : "New Task" }}
            </h2>
            <button
              class="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              @click="$emit('close')"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>

          <TaskForm
            :members="members"
            :task="task"
            @submit="$emit('submit', $event)"
          />

          <CommentSection
            v-if="task && workspaceId && projectId"
            :can-manage="canManage"
            :current-user-id="currentUserId"
            :project-id="projectId"
            :task-id="task.id"
            :workspace-id="workspaceId"
            class="mt-8 border-t border-slate-100 pt-6"
            @comment-count-change="
              (taskId, delta) => $emit('comment-count-change', taskId, delta)
            "
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import type { Task } from "~/types/task";
import TaskForm from "./TaskForm.vue";
import CommentSection from "./CommentSection.vue";

defineProps<{
  show: boolean;
  task?: Task | null;
  members: Array<{ user: { id: string; name: string } }>;
  workspaceId?: string;
  projectId?: string;
  currentUserId?: string;
  canManage?: boolean;
}>();

defineEmits(["close", "submit", "comment-count-change"]);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
