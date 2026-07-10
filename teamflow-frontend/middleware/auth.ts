export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return;

  const authStore = useAuthStore();

  authStore.initializeAuth();

  if (!authStore.token) {
    return navigateTo("/login");
  }

  if (!authStore.user) {
    await authStore.fetchMe();
  }
});
