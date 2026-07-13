<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-slate-700">Team</h3>
      <NuxtLink
        class="text-xs font-medium text-indigo-600 hover:text-indigo-700"
        to="/members"
      >
        Manage →
      </NuxtLink>
    </div>

    <div class="mt-4 flex -space-x-2">
      <div
        v-for="member in accepted.slice(0, 8)"
        :key="member.id"
        :title="member.user.name"
        class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-xs font-semibold text-indigo-700"
      >
        {{ member.user.name.charAt(0).toUpperCase() }}
      </div>

      <div
        v-if="accepted.length > 8"
        class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-semibold text-slate-500"
      >
        +{{ accepted.length - 8 }}
      </div>
    </div>

    <p class="mt-3 text-xs text-slate-400">
      {{ accepted.length }} active member{{ accepted.length === 1 ? "" : "s" }}
      <span v-if="pendingCount > 0">· {{ pendingCount }} pending</span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { WorkspaceMemberSummary } from "~/types/workspace";

const props = defineProps<{
  members: WorkspaceMemberSummary[];
}>();

const accepted = computed(() =>
  props.members.filter((m: any) => m.status !== "PENDING"),
);
const pendingCount = computed(
  () => props.members.filter((m: any) => m.status === "PENDING").length,
);
</script>
