<template>
  <main class="flex min-h-screen items-center justify-center px-4">
    <div
      class="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-slate-200"
    >
      <h1 class="text-3xl font-bold text-slate-900">Create account</h1>
      <p class="mt-2 text-sm text-slate-500">
        Start collaborating with TeamFlow.
      </p>

      <form class="mt-8 space-y-4" @submit.prevent="handleRegister">
        <input
          v-model="name"
          class="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
          placeholder="Name"
          type="text"
        />
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
          Register
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-500">
        Already have an account?
        <NuxtLink class="font-semibold text-indigo-600" to="/login"
          >Login</NuxtLink
        >
      </p>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { AuthService } from "~/services/auth.service";

definePageMeta({ layout: "auth" });

const name = ref("");
const email = ref("");
const password = ref("");

async function handleRegister() {
  await AuthService.register({
    name: name.value,
    email: email.value,
    password: password.value,
  });

  await navigateTo("/login");
}
</script>
