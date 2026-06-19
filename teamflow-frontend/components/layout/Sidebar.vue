<template>
  <div>
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 bg-black/40 lg:hidden"
      @click="$emit('close')"
    />

    <aside
      :class="[
        'fixed left-0 top-0 z-50 h-screen border-r border-slate-200 bg-white px-4 py-6 transition-all duration-300',
        isCollapsed ? 'lg:w-20' : 'lg:w-64',
        'w-64',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <div
        :class="[
          'flex items-center',
          isCollapsed ? 'flex-col gap-3' : 'justify-between',
        ]"
      >
        <LayoutLogo v-if="!isCollapsed" />

        <div
          v-else
          class="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white"
        >
          TF
        </div>

        <button
          class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          @click="$emit('close')"
        >
          ✕
        </button>

        <button
          class="hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:block"
          @click="$emit('toggleCollapse')"
        >
          <PanelLeftClose v-if="!isCollapsed" class="h-5 w-5" />
          <PanelLeftOpen v-else class="h-5 w-5" />
        </button>
      </div>

      <nav class="mt-8 space-y-2">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :class="[
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
            route.path.startsWith(item.to)
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
            isCollapsed ? 'justify-center' : '',
          ]"
          :to="item.to"
          @click="$emit('close')"
        >
          <component :is="item.icon" class="h-5 w-5 shrink-0" />

          <span v-if="!isCollapsed">
            {{ item.label }}
          </span>
        </NuxtLink>
      </nav>
    </aside>
  </div>
</template>

<script lang="ts" setup>
import {
  Bell,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
} from "lucide-vue-next";

defineProps<{
  isOpen: boolean;
  isCollapsed: boolean;
}>();

defineEmits<{
  close: [];
  toggleCollapse: [];
}>();

const route = useRoute();

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Workspaces", to: "/workspaces", icon: Users },
  { label: "Projects", to: "/projects", icon: FolderKanban },
  { label: "Tasks", to: "/tasks", icon: CheckSquare },
  { label: "Notifications", to: "/notifications", icon: Bell },
];
</script>
