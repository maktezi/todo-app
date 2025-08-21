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

            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <!-- Total Tasks Card -->
                <div class="group relative">
                    <div
                        class="absolute inset-0 blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"
                    />
                    <UCard
                        class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                        <template #header>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <span
                                        class="text-gray-700 dark:text-gray-200 font-semibold"
                                    >
                                        Total Tasks
                                    </span>
                                </div>
                            </div>
                        </template>

                        <div class="space-y-2">
                            <div
                                v-if="completedLoading && pendingLoading"
                                class="animate-pulse"
                            >
                                <div
                                    class="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-20"
                                />
                            </div>
                            <div
                                v-else
                                class="text-3xl font-bold text-emerald-600 dark:text-emerald-400"
                            >
                                {{ totalTasks || "—" }}
                            </div>
                            <p
                                class="text-sm text-gray-500 dark:text-gray-400 py-0.5"
                            >
                                All time tasks
                            </p>
                        </div>
                    </UCard>
                </div>

                <!-- Completed Tasks Card -->
                <div class="group relative">
                    <div
                        class="absolute inset-0 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"
                    />
                    <UCard
                        class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                        <template #header>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <span
                                        class="text-gray-700 dark:text-gray-200 font-semibold"
                                    >
                                        Completed
                                    </span>
                                </div>
                            </div>
                        </template>

                        <div class="space-y-2">
                            <div v-if="completedLoading" class="animate-pulse">
                                <div
                                    class="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-16"
                                />
                            </div>
                            <div
                                v-else
                                class="text-3xl font-bold text-green-600 dark:text-green-400"
                            >
                                {{ completedTasks || "—" }}
                            </div>
                            <div class="flex items-center gap-2">
                                <p
                                    class="text-sm text-gray-500 dark:text-gray-400"
                                >
                                    Tasks finished
                                </p>
                                <div v-if="!completedLoading && totalTasks > 0">
                                    <UBadge
                                        variant="solid"
                                        class="font-bold"
                                        color="green"
                                    >
                                        {{
                                            Math.round(
                                                (completedTasks / totalTasks) *
                                                    100,
                                            )
                                        }}%
                                    </UBadge>
                                </div>
                            </div>
                        </div>
                    </UCard>
                </div>

                <!-- Pending Tasks Card -->
                <div class="group relative">
                    <div
                        class="absolute inset-0 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"
                    />
                    <UCard
                        class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                        <template #header>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <span
                                        class="text-gray-700 dark:text-gray-200 font-semibold"
                                    >
                                        Pending
                                    </span>
                                </div>
                            </div>
                        </template>

                        <div class="space-y-2">
                            <div v-if="pendingLoading" class="animate-pulse">
                                <div
                                    class="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-16"
                                />
                            </div>
                            <div
                                v-else
                                class="text-3xl font-bold text-yellow-600 dark:text-yellow-400"
                            >
                                {{ pendingTasks || "—" }}
                            </div>
                            <div class="flex items-center gap-2">
                                <p
                                    class="text-sm text-gray-500 dark:text-gray-400"
                                >
                                    Awaiting action
                                </p>
                                <div v-if="!pendingLoading && pendingTasks > 0">
                                    <UBadge
                                        variant="solid"
                                        class="font-bold"
                                        :color="
                                            pendingTasks > 5 ? 'red' : 'yellow'
                                        "
                                    >
                                        {{
                                            pendingTasks > 5 ? "High" : "Normal"
                                        }}
                                    </UBadge>
                                </div>
                            </div>
                        </div>
                    </UCard>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { tasksPaginate } from "~/graphql/Task";

definePageMeta({ layout: "app-layout", permission: "view dashboard" });

const auth = useAuthStore();
const { appDescription, appTitle, metaDescription } = useConstants();
useHead({
    meta: [{ content: metaDescription, name: "description" }],
    title: `${appTitle} - ${appDescription}`,
});

const customFilters = (status: string) => {
    const filters = [{ key: "status", value: status }];

    if (!auth.is("Admin")) {
        filters.push({ key: "created_by", value: auth.user?.id as string });
    }

    return filters;
};

// Completed
const {
    loading: completedLoading,
    refetch: refetchCompleted,
    result: completedResult,
} = useQuery(tasksPaginate, {
    filter: customFilters("completed"),
    first: 1,
});

// Pending
const {
    loading: pendingLoading,
    refetch: refetchPending,
    result: pendingResult,
} = useQuery(tasksPaginate, {
    filter: customFilters("pending"),
    first: 1,
});

const completedTasks = computed(
    () => completedResult.value?.tasksPaginate?.paginatorInfo?.total || 0,
);
const pendingTasks = computed(
    () => pendingResult.value?.tasksPaginate?.paginatorInfo?.total || 0,
);
const totalTasks = computed(
    () => completedTasks.value + pendingTasks.value || 0,
);

onMounted(() => {
    refetchCompleted();
    refetchPending();
});
</script>
