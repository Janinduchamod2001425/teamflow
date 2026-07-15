export default defineNuxtConfig({
  compatibilityDate: "2026-06-18",

  devtools: {
    enabled: true,
  },

  experimental: {
    appManifest: false,
  },

  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss", "@vueuse/motion/nuxt"],

  runtimeConfig: {
    public: {
      apiBaseUrl: "http://localhost:3000/api/v1",
      socketUrl: "http://localhost:3000",
    },
  },
});
