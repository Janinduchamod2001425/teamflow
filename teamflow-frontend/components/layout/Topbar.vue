<template>
  <header
    class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6"
  >
    <div class="flex items-center gap-3">
      <button
        class="rounded-lg border border-slate-300 px-2 py-1 text-slate-600 hover:bg-slate-50 lg:hidden"
        @click="$emit('toggleSidebar')"
      >
        ☰
      </button>

      <div>
        <h2 class="text-base font-semibold text-slate-900 lg:text-lg">
          Dashboard
        </h2>
        <p class="hidden text-sm text-slate-500 sm:block">
          Manage your team collaboration
        </p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button
        class="hidden rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 sm:block"
      >
        Notifications
      </button>

      <div class="hidden text-right sm:block">
        <p class="text-sm font-semibold text-slate-900">
          {{ authStore.user?.name || "User" }}
        </p>
        <p class="text-xs text-slate-500">
          {{ authStore.user?.email }}
        </p>
      </div>

      <div
        class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600"
      >
        {{ authStore.user?.name?.charAt(0) || "U" }}
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
defineEmits<{
  toggleSidebar: [];
}>();

const authStore = useAuthStore();
</script>
