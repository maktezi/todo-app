<template>
    <NuxtLoadingIndicator />
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
    <UNotifications />
</template>
<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";

const isMobile = ref(false);
const auth = useAuthStore();
const isAdmin = computed(() => auth.user?.is_admin);

const colorMode = useColorMode();
const isDark = computed({
    get() {
        return colorMode.value === "dark";
    },
    set() {
        colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
    },
});

onMounted(() => {
    const mediaQuery = useMediaQuery("(max-width: 768px)");
    isMobile.value = mediaQuery.value;

    watch(mediaQuery, (newValue) => {
        isMobile.value = newValue;
    });
});

provide("isDark", isDark);
provide("isMobile", isMobile);
provide("isAdmin", isAdmin);
</script>
