<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h3 class="mb-4 text-sm font-semibold text-slate-700">Quick Actions</h3>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <button
        v-if="canManage"
        class="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
        @click="$router.push('/projects?action=new')"
      >
        <div
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600"
        >
          <FolderPlus class="h-4.5 w-4.5" />
        </div>
        <span class="text-sm font-medium text-slate-700">New Project</span>
      </button>

      <button
        class="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
        @click="$router.push('/tasks')"
      >
        <div
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600"
        >
          <CheckSquare class="h-4.5 w-4.5" />
        </div>
        <span class="text-sm font-medium text-slate-700">View Tasks</span>
      </button>

      <button
        v-if="canInvite"
        class="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
        @click="$router.push('/members?action=invite')"
      >
        <div
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600"
        >
          <UserPlus class="h-4.5 w-4.5" />
        </div>
        <span class="text-sm font-medium text-slate-700">Invite Member</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CheckSquare, FolderPlus, UserPlus } from "lucide-vue-next";

defineProps<{
  canManage: boolean;
  canInvite: boolean;
}>();
</script>
