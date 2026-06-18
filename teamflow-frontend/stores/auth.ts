import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { AuthService } from "~/services/auth.service";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value);

  async function login(email: string, password: string) {
    loading.value = true;

    try {
      const response = await AuthService.login({ email, password });

      user.value = response.data.data.user;
      token.value = response.data.data.accessToken;

      localStorage.setItem("teamflow_token", token.value!);

      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchMe() {
    if (!token.value) return null;

    const response = await AuthService.me();
    user.value = response.data.data;

    return user.value;
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem("teamflow_token");
    navigateTo("/login");
  }

  function initializeAuth() {
    if (import.meta.client) {
      const savedToken = localStorage.getItem("teamflow_token");

      if (savedToken) {
        token.value = savedToken;
      }
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    fetchMe,
    logout,
    initializeAuth,
  };
});
