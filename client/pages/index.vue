<template>
    <div
        class="h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 overflow-hidden"
    >
        <FluidCursor v-if="isFuildCursorEnabled" />

        <nav
            class="px-6 py-4 flex justify-between items-center border-b border-stone-200 dark:border-stone-800"
        >
            <div class="flex items-center">
                <span class="text-green-600 font-bold text-xl">
                    {{ appTitle }}
                    <span class="text-stone-900 dark:text-stone-50">{{
                        appType
                    }}</span>
                </span>
            </div>

            <ClientOnly>
                <div class="gap-2 flex">
                    <UButton
                        :variant="isFuildCursorEnabled ? 'soft' : 'ghost'"
                        color="primary"
                        :icon="
                            isFuildCursorEnabled
                                ? 'solar:cursor-bold'
                                : 'solar:cursor-broken'
                        "
                        class="hover:scale-110 transition-all duration-300"
                        @click="isFuildCursorEnabled = !isFuildCursorEnabled"
                    />

                    <UButton
                        :icon="
                            !isDark
                                ? 'i-heroicons-sun-20-solid'
                                : 'i-heroicons-moon-20-solid'
                        "
                        color="primary"
                        variant="ghost"
                        aria-label="Theme"
                        class="hover:scale-110 transition-all duration-300"
                        @click="isDark = !isDark"
                    />
                </div>
            </ClientOnly>
        </nav>

        <div
            class="flex-1 flex items-center justify-center relative overflow-hidden"
        >
            <!-- Background gradient circles (green theme) -->
            <div
                class="absolute -top-40 -left-40 w-96 h-96 bg-green-500 rounded-lg opacity-5 dark:opacity-10 blur-3xl"
            />
            <div
                class="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500 rounded-lg opacity-5 dark:opacity-10 blur-3xl"
            />

            <div class="max-w-2xl mx-auto px-6 text-center z-10">
                <h1
                    class="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
                >
                    <span
                        class="bg-gradient-to-r from-stone-900 via-green-900 to-emerald-900 dark:from-stone-50 dark:via-green-100 dark:to-emerald-100 bg-clip-text text-transparent drop-shadow-sm"
                    >
                        {{ appTitle }}
                    </span>
                    <span
                        class="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent animate-pulse"
                    >
                        {{ appType }}
                    </span>
                </h1>

                <p
                    class="text-stone-600 text-lg dark:text-stone-300 mb-8 max-w-2xl mx-auto leading-relaxed font-light"
                >
                    <span
                        class="font-medium bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                    >
                        {{ appDescription }}
                    </span>
                </p>

                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <UButton
                        class="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg px-6 py-2"
                        @click="navigateTo('/register')"
                    >
                        Register
                    </UButton>
                    <UButton
                        variant="ghost"
                        class="text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 rounded-lg px-6 py-2 hover:border-green-500 hover:text-green-500 dark:hover:border-green-400 dark:hover:text-green-400"
                        @click="navigateTo('/login')"
                    >
                        Login
                    </UButton>
                </div>
            </div>
        </div>

        <footer
            class="py-4 px-6 border-t border-stone-200 dark:border-stone-800 text-center"
        >
            <div class="flex justify-center space-x-6 mb-3">
                <a
                    href="#"
                    class="text-stone-500 dark:text-stone-500 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                >
                    <UIcon name="i-heroicons-phone" size="sm" />
                </a>
                <a
                    href="#"
                    class="text-stone-500 dark:text-stone-500 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                >
                    <UIcon name="i-heroicons-envelope" size="sm" />
                </a>
                <a
                    href="#"
                    class="text-stone-500 dark:text-stone-500 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                >
                    <UIcon name="i-simple-icons-facebook" size="sm" />
                </a>
            </div>
            <p class="text-xs text-stone-500 dark:text-stone-500">
                © {{ getYear() }} {{ appTitle }}. {{ appDescription }}
            </p>
        </footer>
    </div>
</template>

<script setup lang="ts">
const getYear = () => new Date().getFullYear();
const isFuildCursorEnabled = ref(true);
const colorMode = useColorMode();
const isDark = computed({
    get() {
        return colorMode.value === "dark";
    },
    set() {
        colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
    },
});

const { appDescription, appTitle, appType, metaDescription } = useConstants();
useHead({
    meta: [
        {
            content: metaDescription,
            name: "description",
        },
    ],
    title: `${appTitle} - ${appDescription}`,
});
</script>
