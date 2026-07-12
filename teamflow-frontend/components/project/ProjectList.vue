<template>
  <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    <ProjectCard
      v-for="(project, i) in projects"
      :key="project.id"
      :index="i"
      :project="project"
      @delete="$emit('delete', $event)"
      @edit="$emit('edit', $event)"
      @open="$emit('open', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import ProjectCard from "./ProjectCard.vue";
import type { Project } from "~/types/project";

defineProps<{
  projects: Project[];
}>();

defineEmits<{
  open: [project: Project];
  edit: [project: Project];
  delete: [project: Project];
}>();
</script>
