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

            <!-- Statistics Cards -->
            <div
                v-if="auth.user?.roles[0]?.name !== 'User'"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                <!-- Pending Documents -->
                <UCard class="hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <p
                                class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                            >
                                Pending Documents
                            </p>

                            <!-- Loading State -->
                            <div
                                v-if="pendingDocsLoading"
                                class="mt-2 space-y-2"
                            >
                                <div
                                    class="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"
                                />
                                <div class="flex items-center space-x-2">
                                    <div
                                        class="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12"
                                    />
                                    <div
                                        class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"
                                    />
                                </div>
                            </div>

                            <!-- Loaded Content -->
                            <div v-else>
                                <p
                                    class="text-3xl font-bold text-gray-900 dark:text-white mt-2"
                                >
                                    {{ totalPendingDocs }}
                                </p>
                                <div class="flex items-center mt-2">
                                    <UBadge
                                        color="yellow"
                                        variant="subtle"
                                        size="sm"
                                    >
                                        {{ totalPendingDocsToday }}
                                    </UBadge>
                                    <span
                                        class="text-gray-500 dark:text-gray-400 text-sm ml-2"
                                    >
                                        new today
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Icon with loading state -->
                        <div class="flex-shrink-0">
                            <div
                                v-if="pendingDocsLoading"
                                class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                            />
                            <UIcon
                                v-else
                                name="i-heroicons-document-text"
                                class="w-8 h-8 text-yellow-500"
                            />
                        </div>
                    </div>
                </UCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Document } from "~/types/codegen/graphql";

import {
    recentDocuments,
    totalPendingDocuments,
    totalPendingNewToday,
} from "~/graphql/Document";

const auth = useAuthStore();
const recentDocs: Ref<Document[]> = ref([]);
const totalPendingDocs = ref(0);
const totalPendingDocsToday = ref(0);

const {
    loading: documentsLoading,
    refetch: refetchDocuments,
    result: documentsResult,
} = useQuery(recentDocuments);
const {
    loading: pendingDocsLoading,
    refetch: refetchDocsPending,
    result: docsPendingResult,
} = useQuery(totalPendingDocuments);
const { refetch: refetchPendingDocsToday, result: pendingDocsTodayResult } =
    useQuery(totalPendingNewToday);

onMounted(async () => {
    await Promise.all([
        refetchDocuments(),
        refetchDocsPending(),
        refetchPendingDocsToday(),
    ]);
    if (documentsResult.value)
        recentDocs.value = documentsResult.value.documentsPaginate.data;
    if (docsPendingResult.value)
        totalPendingDocs.value = docsPendingResult.value.totalPendingDocuments;
    if (pendingDocsTodayResult.value)
        totalPendingDocsToday.value =
            pendingDocsTodayResult.value.totalPendingNewToday;
});

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
