<template>
  <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    <WorkspaceCard
      v-for="workspace in workspaces"
      :key="workspace.id"
      :workspace="workspace"
      @delete="$emit('delete', $event)"
      @edit="$emit('edit', $event)"
      @open="$emit('open', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import WorkspaceCard from "./WorkspaceCard.vue";

import type { Workspace } from "~/types/workspace";

defineProps<{
  workspaces: Workspace[];
}>();

defineEmits(["open", "edit", "delete"]);
</script>
