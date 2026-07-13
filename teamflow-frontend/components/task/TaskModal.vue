<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        @click.self="$emit('close')"
      >
        <div
          class="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl shadow-black/5 backdrop-blur-xl lg:max-w-4xl"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between border-b border-slate-100 p-6 lg:p-8 lg:pb-6"
          >
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

          <!-- Body: stacked on mobile, side-by-side on desktop -->
          <div class="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
            <!-- Left: task form -->
            <div
              class="overflow-y-auto p-6 lg:w-1/2 lg:border-r lg:border-slate-100 lg:p-8"
            >
              <TaskForm
                :members="members"
                :task="task"
                @submit="$emit('submit', $event)"
              />
            </div>

            <!-- Right: attachments + comments (only once the task actually exists) -->
            <div
              v-if="task && workspaceId"
              class="overflow-y-auto p-6 lg:w-1/2 lg:p-8"
            >
              <AttachmentSection
                :task-id="task.id"
                :workspace-id="workspaceId"
              />

              <CommentSection
                v-if="projectId"
                :can-manage="canManage"
                :current-user-id="currentUserId"
                :project-id="projectId"
                :task-id="task.id"
                :workspace-id="workspaceId"
                class="mt-8 border-t border-slate-100 pt-6"
                @comment-count-change="
                  (taskId: string, delta: number) =>
                    $emit('comment-count-change', taskId, delta)
                "
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import type { Task } from "~/types/task";
import TaskForm from "./TaskForm.vue";
import CommentSection from "./CommentSection.vue";
import AttachmentSection from "./AttachmentSection.vue";

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
