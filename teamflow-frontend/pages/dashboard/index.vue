<template>
  <section class="space-y-6">
    <!-- Loading workspace – enhanced spinner -->
    <div
      v-if="loadingWorkspace"
      class="flex min-h-[80vh] items-center justify-center"
    >
      <div class="flex flex-col items-center space-y-4">
        <!-- Spinner with gradient ring -->
        <div class="relative">
          <div
            class="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"
          ></div>
        </div>
        <p class="text-sm font-medium text-slate-500 animate-pulse">
          Loading workspace...
        </p>
      </div>
    </div>
    <!-- No workspace selected -->
    <div
      v-else-if="!workspace"
      class="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-10 text-center"
    >
      <p class="text-slate-600">Select a workspace first.</p>
      <NuxtLink
        class="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        to="/workspaces"
      >
        Go to Workspaces
      </NuxtLink>
    </div>

    <!-- Dashboard content -->
    <template v-else>
      <div>
        <h1 class="text-3xl font-bold text-slate-900">{{ workspace.name }}</h1>
        <p class="text-slate-500">{{ workspace.description }}</p>
      </div>

      <div
        v-if="dashboardStore.loading && !dashboardStore.data"
        class="py-20 text-center text-slate-400"
      >
        Loading dashboard...
      </div>

      <template v-else-if="dashboardStore.data">
        <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            :value="dashboardStore.data.overview.totalProjects"
            accent="indigo"
            title="Projects"
          >
            <FolderKanban class="h-6 w-6" />
          </StatCard>

          <StatCard
            :value="dashboardStore.data.overview.totalMembers"
            accent="indigo"
            title="Members"
          >
            <Users class="h-6 w-6" />
          </StatCard>

          <StatCard
            :subtext="`${dashboardStore.data.overview.completionRate}% complete`"
            :value="`${dashboardStore.data.overview.completedTasks} / ${dashboardStore.data.overview.totalTasks}`"
            accent="emerald"
            title="Tasks Completed"
          >
            <CheckSquare class="h-6 w-6" />
          </StatCard>

          <StatCard
            :accent="
              dashboardStore.data.overview.overdueTasks > 0 ? 'red' : 'indigo'
            "
            :value="dashboardStore.data.overview.overdueTasks"
            title="Overdue"
          >
            <AlertTriangle class="h-6 w-6" />
          </StatCard>
        </div>

        <QuickActions
          :can-invite="workspaceStore.isAdmin"
          :can-manage="workspaceStore.isManagerOrAbove"
        />

        <div class="grid gap-6 lg:grid-cols-3">
          <div class="space-y-6 lg:col-span-2">
            <TaskStatusBreakdown :data="dashboardStore.data.tasksByStatus" />
            <MyTasksWidget
              :user-id="authStore.user?.id"
              :workspace-id="workspace.id"
            />
            <ProjectsOverview :projects="projectStore.projects" />
          </div>

          <div class="space-y-6">
            <TeamPreview :members="workspace.members || []" />
            <ActivityFeed :activities="dashboardStore.data.recentActivities" />
          </div>
        </div>
      </template>
    </template>
  </section>
</template>

<script lang="ts" setup>
import {
  AlertTriangle,
  CheckSquare,
  FolderKanban,
  Users,
} from "lucide-vue-next";
import StatCard from "~/components/dashboard/StatCard.vue";
import TaskStatusBreakdown from "~/components/dashboard/TaskStatusBreakdown.vue";
import ActivityFeed from "~/components/dashboard/ActivityFeed.vue";
import QuickActions from "~/components/dashboard/QuickActions.vue";
import MyTasksWidget from "~/components/dashboard/MyTasksWidget.vue";
import ProjectsOverview from "~/components/dashboard/ProjectsOverview.vue";
import TeamPreview from "~/components/dashboard/TeamPreview.vue";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const workspaceStore = useWorkspaceStore();
const dashboardStore = useDashboardStore();
const projectStore = useProjectStore();
const authStore = useAuthStore();

const workspace = computed(() => workspaceStore.selectedWorkspace);
const loadingWorkspace = ref(true);

async function loadEverything() {
  if (!workspace.value) return;
  await Promise.all([
    dashboardStore.fetchDashboard(workspace.value.id),
    projectStore.fetchProjects(workspace.value.id),
  ]);
}

onMounted(async () => {
  loadingWorkspace.value = true;
  await workspaceStore.initializeWorkspace();
  loadingWorkspace.value = false;
  if (workspace.value) {
    await loadEverything();
  }
});

watch(workspace, async (ws) => {
  if (ws) {
    await loadEverything();
  } else {
    dashboardStore.reset();
    projectStore.reset();
  }
});
</script>
