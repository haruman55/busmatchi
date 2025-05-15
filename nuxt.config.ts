export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module', '@nuxt/eslint'],
  vuetify: {
    vuetifyOptions: {
      theme: {
        themes: {
          light: {
            colors: {
              primary: '#05677e',
              secondary: '#a3bbc5',
              background: '#f8f3ed',
            },
          },
        },
      },
    },
  },
   css: ['@/assets/css/global.css'],
})
