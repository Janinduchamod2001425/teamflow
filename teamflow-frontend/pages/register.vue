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

    <!-- Registration Card -->
    <div
      class="relative w-full max-w-md rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-2xl shadow-slate-400/20 backdrop-blur-xl"
    >
      <!-- Logo/Brand Area -->
      <div class="mb-8 flex items-center justify-center">
        <div
          class="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-purple-100 shadow-lg shadow-indigo-200"
        >
          <!-- New logo image -->
          <img
            alt="TeamFlow logo"
            class="h-10 w-10 rounded-xl object-contain"
            src="/teamflow_logo.svg"
          />
        </div>
      </div>

      <h1 class="text-center text-3xl font-bold tracking-tight text-slate-900">
        Create account
      </h1>
      <p class="mt-2 text-center text-sm text-slate-500">
        Start collaborating with TeamFlow
      </p>

      <form class="mt-8 space-y-5" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <!-- Name Input -->
          <div class="relative">
            <input
              v-model="name"
              class="peer w-full rounded-xl border border-slate-300 bg-white/50 px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              placeholder="Full name"
              required
              type="text"
            />
            <svg
              class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 peer-focus:text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              />
            </svg>
          </div>

          <!-- Email Input -->
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

          <!-- Password Input with Toggle -->
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
              <!-- Eye Icon (visible) -->
              <svg
                v-if="showPassword"
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
              <!-- Eye Slash Icon (hidden) -->
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

        <!-- Terms & Conditions -->
        <div class="flex items-start gap-2 text-sm text-slate-600">
          <input
            class="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            required
            type="checkbox"
          />
          <span>
            I agree to the
            <NuxtLink
              class="font-medium text-indigo-600 hover:text-indigo-500"
              to="/terms"
            >
              Terms of Service
            </NuxtLink>
            and
            <NuxtLink
              class="font-medium text-indigo-600 hover:text-indigo-500"
              to="/privacy"
            >
              Privacy Policy
            </NuxtLink>
          </span>
        </div>

        <!-- Submit Button -->
        <button
          class="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-300"
          type="submit"
        >
          <span
            class="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 opacity-0 transition-opacity group-hover:opacity-100"
          ></span>
          <span class="relative flex items-center justify-center gap-2">
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
            Create account
          </span>
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-500">
        Already have an account?
        <NuxtLink
          class="font-semibold text-indigo-600 hover:text-indigo-500"
          to="/login"
        >
          Login
        </NuxtLink>
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
const showPassword = ref(false);

async function handleRegister() {
  await AuthService.register({
    name: name.value,
    email: email.value,
    password: password.value,
  });

  await navigateTo("/login");
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
