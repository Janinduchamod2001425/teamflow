<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        @click.self="$emit('close')"
      >
        <div
          class="w-full max-w-lg rounded-3xl border border-white/20 bg-white p-8 shadow-2xl shadow-black/5 backdrop-blur-xl"
        >
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-slate-900">
              {{ project ? "Edit Project" : "Create Project" }}
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

          <ProjectForm :project="project" @submit="$emit('submit', $event)" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import type { Project } from "~/types/project";
import ProjectForm from "./ProjectForm.vue";

defineProps<{
  show: boolean;
  project?: Project | null;
}>();

defineEmits(["close", "submit"]);
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
