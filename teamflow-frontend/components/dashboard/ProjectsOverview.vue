<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-slate-700">Projects</h3>
      <NuxtLink
        class="text-xs font-medium text-indigo-600 hover:text-indigo-700"
        to="/projects"
      >
        View all →
      </NuxtLink>
    </div>

    <div v-if="projects.length === 0" class="mt-4 text-sm text-slate-400">
      No projects yet.
    </div>

    <div
      v-else
      class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      <button
        v-for="project in projects.slice(0, 6)"
        :key="project.id"
        class="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-indigo-300 hover:shadow-sm"
        @click="
          $router.push({ path: '/tasks', query: { projectId: project.id } })
        "
      >
        <div
          :style="{ backgroundColor: project.color || '#6366f1' }"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
        >
          {{ project.name.charAt(0).toUpperCase() }}
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm font-medium text-slate-800">
            {{ project.name }}
          </p>
          <p class="truncate text-xs text-slate-400">
            {{ project.description || "No description" }}
          </p>
        </div>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Project } from "~/types/project";

defineProps<{
  projects: Project[];
}>();
</script>
