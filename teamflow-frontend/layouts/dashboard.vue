<template>
  <div class="min-h-screen bg-slate-50">
    <LayoutSidebar
      :is-collapsed="isSidebarCollapsed"
      :is-open="isSidebarOpen"
      @close="isSidebarOpen = false"
      @toggle-collapse="isSidebarCollapsed = !isSidebarCollapsed"
    />

    <div
      :class="[
        'min-h-screen transition-all duration-300',
        isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64',
      ]"
    >
      <LayoutTopbar @toggle-sidebar="isSidebarOpen = true" />

      <LayoutPageContainer>
        <slot />
      </LayoutPageContainer>
    </div>
  </div>
</template>

<script lang="ts" setup>
const isSidebarOpen = ref(false);
const isSidebarCollapsed = ref(false);
</script>
