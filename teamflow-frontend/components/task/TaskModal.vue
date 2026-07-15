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
            <div class="overflow-y-auto p-6 lg:w-1/2 lg:p-8">
              <template v-if="task && workspaceId">
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
              </template>

              <div
                v-else
                class="flex h-full flex-col items-center justify-center py-12 text-center"
              >
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-300"
                >
                  <svg
                    class="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                    />
                  </svg>
                </div>
                <p class="mt-3 text-sm font-medium text-slate-500">
                  Comments &amp; attachments
                </p>
                <p class="mt-1 max-w-[220px] text-xs text-slate-400">
                  Save this task first, then you'll be able to add files and
                  start a discussion.
                </p>
              </div>
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
