<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
    >
        <div class="text-center px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
                <div class="mx-auto h-24 w-24 text-red-500 dark:text-red-400">
                    <UIcon
                        name="i-heroicons-shield-exclamation"
                        class="w-full h-full"
                    />
                </div>
            </div>

            <div class="mb-8">
                <h1
                    class="text-4xl font-bold text-gray-900 dark:text-white mb-4"
                >
                    Access Denied
                </h1>
                <p
                    class="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto"
                >
                    You don't have permission to access this page. Please
                    contact an administrator.
                </p>
            </div>

            <div
                class="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
                <UButton
                    color="gray"
                    variant="outline"
                    size="lg"
                    icon="i-heroicons-arrow-left"
                    class="w-full sm:w-auto"
                    @click="$router.go(-1)"
                >
                    Go back
                </UButton>
            </div>

            <div
                class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
            >
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Need help accessing this content?
                </p>
                <div
                    class="flex flex-col sm:flex-row gap-4 justify-center text-sm"
                >
                    <ULink
                        to="/contact"
                        class="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                        Contact support
                    </ULink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
useSeoMeta({
    description: "You do not have permission to access this page.",
    title: "401 - Unauthorized Access",
});

if (import.meta.server) {
    setResponseStatus(401);
}
</script>
