<template>
    <div class="h-screen overflow-auto bg-gray-50 dark:bg-gray-900">
        <AppHeader title="Dashboard" @toggle-sidebar="toggleSidebar" />
        <slot />
    </div>
</template>

<script setup lang="ts">
const showSidebar = ref(false);
const isMobile = ref(false);

const toggleSidebar = () => (showSidebar.value = !showSidebar.value);
const checkScreenSize = () => {
    isMobile.value = window.innerWidth < 1024;
    showSidebar.value = !isMobile.value;
};

onMounted(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
});

onUnmounted(() => {
    window.removeEventListener("resize", checkScreenSize);
});
</script>
