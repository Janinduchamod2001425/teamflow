<template>
  <main class="flex min-h-screen items-center justify-center px-4">
    <div
      class="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-slate-200"
    >
      <h1 class="text-3xl font-bold text-slate-900">Welcome back</h1>
      <p class="mt-2 text-sm text-slate-500">Login to continue TeamFlow.</p>

      <form class="mt-8 space-y-4" @submit.prevent="handleLogin">
        <input
          v-model="email"
          class="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
          placeholder="Email"
          type="email"
        />
        <input
          v-model="password"
          class="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
          placeholder="Password"
          type="password"
        />

        <button
          class="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {{ authStore.loading ? "Logging in..." : "Login" }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-500">
        Don't have an account?
        <NuxtLink class="font-semibold text-indigo-600" to="/register"
          >Register</NuxtLink
        >
      </p>
    </div>
  </main>
</template>

<script lang="ts" setup>
definePageMeta({ layout: "auth" });

const authStore = useAuthStore();

const email = ref("");
const password = ref("");

async function handleLogin() {
  await authStore.login(email.value, password.value);
  await navigateTo("/dashboard");
}
</script>
