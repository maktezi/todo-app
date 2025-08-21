<template>
    <ManageDocument />
</template>

<script setup lang="ts">
import ManageDocument from "./components/manage-document.vue";

definePageMeta({ layout: "app-layout", permission: "view document" });

const route = useRoute();
const routeName = computed(() => route.name ?? "Page");
const { appTitle, metaDescription } = useConstants();
useHead({
    meta: [
        {
            content: metaDescription,
            name: "description",
        },
    ],
    title: `${appTitle} - ${toTitleCase(String(routeName.value))}`,
});
</script>
