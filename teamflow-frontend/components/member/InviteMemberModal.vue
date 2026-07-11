<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        @click.self="$emit('close')"
      >
        <div
          class="w-full max-w-md rounded-3xl border border-white/20 bg-white p-8 shadow-2xl shadow-black/5 backdrop-blur-xl"
        >
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-slate-900">Invite Member</h2>
            <button
              class="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              @click="$emit('close')"
            >
              <svg
                class="h-6 w-6"
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

          <form class="space-y-5" @submit.prevent="submit">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700"
                >Email Address</label
              >
              <input
                v-model="email"
                class="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                placeholder="teammate@example.com"
                required
                type="email"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700"
                >Role</label
              >
              <select
                v-model="role"
                class="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-900 backdrop-blur-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="MEMBER">Member</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
              <p class="mt-1.5 text-xs text-slate-400">
                Admins can manage members and roles. Managers can create/edit
                projects and tasks.
              </p>
            </div>

            <button
              :disabled="loading"
              class="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-300 disabled:opacity-60"
            >
              {{ loading ? "Sending invite..." : "Send Invite" }}
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { Role } from "~/types/member";

const props = defineProps<{
  show: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [payload: { email: string; role: Role }];
}>();

const email = ref("");
const role = ref<Role>("MEMBER");

watch(
  () => props.show,
  (val) => {
    if (val) {
      email.value = "";
      role.value = "MEMBER";
    }
  },
);

function submit() {
  emit("submit", { email: email.value, role: role.value });
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
