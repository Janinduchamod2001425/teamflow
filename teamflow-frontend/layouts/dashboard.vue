<template>
  <div class="min-h-screen bg-slate-50">
    <Sidebar />

    <div class="ml-64 min-h-screen">
      <Topbar />

      <PageContainer>
        <slot />
      </PageContainer>
    </div>
  </div>
</template>
