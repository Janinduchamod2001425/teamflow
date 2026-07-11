<template>
  <form class="space-y-5" @submit.prevent="submit">
    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">
        Workspace Name
      </label>
      <input
        v-model="form.name"
        class="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
        placeholder="Development Team"
        type="text"
      />
    </div>

    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">
        Description
      </label>
      <textarea
        v-model="form.description"
        class="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
        rows="4"
      />
    </div>

    <button
      class="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-300"
    >
      {{ workspace ? "Update Workspace" : "Create Workspace" }}
    </button>
  </form>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";
import type { Workspace, CreateWorkspaceDto } from "~/types/workspace";

const props = defineProps<{
  workspace?: Workspace | null;
}>();

const emit = defineEmits<{
  (e: "submit", data: CreateWorkspaceDto): void;
}>();

const form = reactive<CreateWorkspaceDto>({
  name: "",
  description: "",
});

watch(
  () => props.workspace,
  (workspace) => {
    if (workspace) {
      form.name = workspace.name;
      form.description = workspace.description ?? "";
    } else {
      form.name = "";
      form.description = "";
    }
  },
  { immediate: true },
);

function submit() {
  emit("submit", {
    name: form.name,
    description: form.description,
  });
}
</script>
