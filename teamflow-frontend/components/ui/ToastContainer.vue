<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="styles[toast.type].wrapper"
          class="pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm"
        >
          <div :class="styles[toast.type].icon" class="mt-0.5 shrink-0">
            <svg
              v-if="toast.type === 'success'"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 13l4 4L19 7"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
            <svg
              v-else-if="toast.type === 'error'"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
            <svg
              v-else-if="toast.type === 'warning'"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 9v3.75m9-3.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
            <svg
              v-else
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </div>

          <p
            :class="styles[toast.type].text"
            class="flex-1 text-sm font-medium"
          >
            {{ toast.message }}
          </p>

          <button
            class="shrink-0 rounded p-0.5 text-slate-400 hover:text-slate-600"
            @click="remove(toast.id)"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
const { toasts, remove } = useToast();

const styles = {
  success: {
    wrapper: "border-emerald-200 bg-emerald-50/95 text-emerald-900",
    icon: "text-emerald-600",
    text: "text-emerald-800",
  },
  error: {
    wrapper: "border-red-200 bg-red-50/95 text-red-900",
    icon: "text-red-600",
    text: "text-red-800",
  },
  warning: {
    wrapper: "border-amber-200 bg-amber-50/95 text-amber-900",
    icon: "text-amber-600",
    text: "text-amber-800",
  },
  info: {
    wrapper: "border-indigo-200 bg-indigo-50/95 text-indigo-900",
    icon: "text-indigo-600",
    text: "text-indigo-800",
  },
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}
</style>
