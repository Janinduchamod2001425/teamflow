<template>
  <main
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4"
  >
    <!-- Animated Background Blobs -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -left-40 -top-40 h-96 w-96 animate-blob rounded-full bg-purple-700/30 mix-blend-multiply blur-3xl filter"
      ></div>
      <div
        class="animation-delay-2000 absolute -right-40 -top-40 h-96 w-96 animate-blob rounded-full bg-indigo-600/30 mix-blend-multiply blur-3xl filter"
      ></div>
      <div
        class="animation-delay-4000 absolute -bottom-40 left-20 h-96 w-96 animate-blob rounded-full bg-blue-600/30 mix-blend-multiply blur-3xl filter"
      ></div>
      <div
        class="absolute right-20 top-1/2 h-72 w-72 animate-blob rounded-full bg-violet-600/20 mix-blend-multiply blur-3xl filter"
      ></div>
    </div>

    <!-- Grid Pattern Overlay -->
    <div
      class="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"
    ></div>

    <!-- Login Card -->
    <div
      class="relative w-full max-w-md rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-200/20 backdrop-blur-xl"
    >
      <!-- Logo/Brand Area -->
      <div class="mb-8 flex items-center justify-center">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200"
        >
          <svg
            class="h-6 w-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
        </div>
      </div>

      <h1 class="text-center text-3xl font-bold tracking-tight text-slate-900">
        Welcome back
      </h1>
      <p class="mt-2 text-center text-sm text-slate-500">
        Login to continue with TeamFlow
      </p>

      <form class="mt-8 space-y-5" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div class="relative">
            <input
              v-model="email"
              class="peer w-full rounded-xl border border-slate-300 bg-white/50 px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              placeholder="Email address"
              required
              type="email"
            />
            <svg
              class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 peer-focus:text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              />
            </svg>
          </div>

          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="peer w-full rounded-xl border border-slate-300 bg-white/50 px-4 py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              placeholder="Password"
              required
            />
            <svg
              class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 peer-focus:text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              />
            </svg>
            <button
              class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:text-indigo-500 focus:outline-none"
              type="button"
              @click="showPassword = !showPassword"
            >
              <!-- Eye Slash Icon (hidden) -->
              <svg
                v-if="!showPassword"
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                />
              </svg>
              <!-- Eye Icon (visible) -->
              <svg
                v-else
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                />
                <path
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 text-slate-600">
            <input
              class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              type="checkbox"
            />
            <span>Remember me</span>
          </label>
          <NuxtLink
            class="font-medium text-indigo-600 hover:text-indigo-500"
            to="/forgot-password"
          >
            Forgot password?
          </NuxtLink>
        </div>

        <button
          :disabled="authStore.loading"
          class="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            class="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 opacity-0 transition-opacity group-hover:opacity-100"
          ></span>
          <span class="relative flex items-center justify-center gap-2">
            <svg
              v-if="authStore.loading"
              class="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              ></path>
            </svg>
            {{ authStore.loading ? "Logging in..." : "Login" }}
          </span>
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-500">
        Don't have an account?
        <NuxtLink
          class="font-semibold text-indigo-600 hover:text-indigo-500"
          to="/register"
        >
          Register
        </NuxtLink>
      </p>
    </div>
  </main>
</template>

<script lang="ts" setup>
definePageMeta({ layout: "auth" });

const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const showPassword = ref(false);

async function handleLogin() {
  await authStore.login(email.value, password.value);
  await navigateTo("/dashboard");
}
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
