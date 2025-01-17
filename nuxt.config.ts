export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  ssr: true, 
  compatibilityDate: '2025-01-17',
  modules: ['@nuxtjs/google-fonts', '@pinia/nuxt'],
  googleFonts: {
    families: {
      Sarabun: [400, 500, 600, 700],
      Inter: [400, 500, 600, 700],
      Kanit: [400, 500, 600, 700],
      Prompt: [400, 500, 600, 700],
    },
    display: 'swap',
  },
});
