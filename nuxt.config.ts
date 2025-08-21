// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    apollo: {
        autoImports: true,
        clients: {
            default: { httpEndpoint: import.meta.env.APP_URL + "/graphql" },
        },
    },
    colorMode: {
        classSuffix: "",
    },
    compatibilityDate: "2024-11-01",
    css: ["~/assets/css/main.css"],
    devtools: { enabled: true },
    dir: {
        public: "public/client",
    },
    future: {
        compatibilityVersion: 4,
    },
    imports: { dirs: ["~/stores", "~/utils", "~/composables/*/*.{ts,js}"] },
    modules: [
        "@nuxtjs/color-mode",
        "@nuxt/eslint",
        "@nuxt/ui",
        "@nuxtjs/tailwindcss",
        "@nuxtjs/apollo",
        "@pinia/nuxt",
        "@pinia-plugin-persistedstate/nuxt",
    ],
    postcss: {
        plugins: {
            autoprefixer: {},
        },
    },
    runtimeConfig: {
        public: {
            API_URL: import.meta.env.APP_URL,
            OTP_SECRET_KEY: import.meta.env.OTP_SECRET_KEY,
        },
    },
    srcDir: "client/",
    tailwindcss: {
        configPath: "./tailwind.config.js",
    },
});
