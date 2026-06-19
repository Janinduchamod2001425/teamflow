<template>
  <header
    class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-sm lg:px-6"
  >
    <div class="flex items-center gap-3">
      <button
        class="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 lg:hidden"
        @click="$emit('toggleSidebar')"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
          />
        </svg>
      </button>

      <div>
        <h2
          class="text-base font-semibold tracking-tight text-slate-900 lg:text-lg"
        >
          {{ pageTitle }}
        </h2>
        <p class="hidden text-sm text-slate-500 sm:block">
          Manage your team collaboration
        </p>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <!-- Notifications Link with Indicator -->
      <NuxtLink
        class="relative hidden rounded-lg border border-slate-200 p-2 text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 sm:block"
        to="/notifications"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
          />
        </svg>
        <span class="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
          <span
            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500"
          ></span>
        </span>
      </NuxtLink>

      <!-- Divider -->
      <div class="hidden h-8 w-px bg-slate-200 sm:block"></div>

      <!-- User Info -->
      <div class="hidden text-right sm:block">
        <p class="text-sm font-medium leading-tight text-slate-900">
          {{ authStore.user?.name || "User" }}
        </p>
        <p class="text-xs leading-tight text-slate-500">
          {{ authStore.user?.email }}
        </p>
      </div>

      <!-- Avatar -->
      <div
        class="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-sm ring-2 ring-white transition-transform hover:scale-105"
      >
        {{ authStore.user?.name?.charAt(0)?.toUpperCase() || "U" }}
      </div>

      <!-- Logout Button -->
      <button
        class="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
        @click="authStore.logout()"
      >
        Logout
      </button>
    </div>
  </header>
</template>

<script lang="ts" setup>
defineEmits<{
  toggleSidebar: [];
}>();

const route = useRoute();
const authStore = useAuthStore();

const pageTitle = computed(() => {
  if (route.path.startsWith("/workspaces")) return "Workspaces";
  if (route.path.startsWith("/projects")) return "Projects";
  if (route.path.startsWith("/tasks")) return "Tasks";
  if (route.path.startsWith("/notifications")) return "Notifications";
  return "Dashboard";
});
</script>
