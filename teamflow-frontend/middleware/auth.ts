export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();

  authStore.initializeAuth();

  if (!authStore.isAuthenticated) {
    return navigateTo("/login");
  }

  if (!authStore.user) {
    await authStore.fetchMe();
  }
});
