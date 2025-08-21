<template>
    <div class="min-h-[calc(90vh-100px)] bg-gray-50 dark:bg-gray-900">
        <div class="max-w-[1600px] mx-auto p-6">
            <!-- Header Section -->
            <div class="mb-8">
                <h1
                    class="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                >
                    {{ appTitle }}
                </h1>
                <p class="text-gray-600 dark:text-gray-400">
                    {{ appDescription }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "app-layout", permission: "view dashboard" });
const { appDescription, appTitle, metaDescription } = useConstants();
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
