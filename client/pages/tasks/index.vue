<template>
    <ManageTask />
</template>

<script setup lang="ts">
import ManageTask from "./components/manage-task.vue";

definePageMeta({ layout: "app-layout", permission: "view task" });

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
