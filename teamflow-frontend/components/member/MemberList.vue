<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <table class="w-full text-left text-sm">
      <thead
        class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"
      >
        <tr>
          <th class="px-4 py-3">Member</th>
          <th class="px-4 py-3">Email</th>
          <th class="px-4 py-3">Role</th>
          <th class="px-4 py-3">Joined</th>
          <th class="px-4 py-3"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="member in members"
          :key="member.id"
          class="border-b border-slate-100 last:border-0 hover:bg-slate-50"
        >
          <td class="px-4 py-3">
            <div class="flex items-center gap-2.5">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700"
              >
                {{ member.user.name.charAt(0).toUpperCase() }}
              </div>
              <span class="font-medium text-slate-800">
                {{ member.user.name }}
                <span
                  v-if="member.user.id === currentUserId"
                  class="text-xs font-normal text-slate-400"
                  >(you)</span
                >
              </span>
            </div>
          </td>
          <td class="px-4 py-3 text-slate-500">{{ member.user.email }}</td>
          <td class="px-4 py-3">
            <select
              v-if="canManage && member.user.id !== currentUserId"
              :value="member.role"
              class="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium"
              @change="
                $emit(
                  'changeRole',
                  member,
                  ($event.target as HTMLSelectElement).value,
                )
              "
            >
              <option value="MEMBER">Member</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
            <span
              v-else
              :class="roleStyles[member.role]"
              class="rounded-full px-2 py-0.5 text-xs font-medium"
            >
              {{ member.role }}
            </span>
          </td>
          <td class="px-4 py-3 text-slate-500">
            {{ formatDate(member.createdAt) }}
          </td>
          <td class="px-4 py-3 text-right">
            <button
              v-if="canManage && member.user.id !== currentUserId"
              class="text-xs text-red-500 hover:text-red-700"
              @click="$emit('remove', member)"
            >
              Remove
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import type { WorkspaceMember, Role } from "~/types/member";

defineProps<{
  members: WorkspaceMember[];
  currentUserId?: string;
  canManage: boolean;
}>();

defineEmits<{
  changeRole: [member: WorkspaceMember, role: string];
  remove: [member: WorkspaceMember];
}>();

const roleStyles: Record<Role, string> = {
  ADMIN: "bg-indigo-100 text-indigo-700",
  MANAGER: "bg-blue-100 text-blue-700",
  MEMBER: "bg-slate-100 text-slate-600",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>
