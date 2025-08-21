<template>
    <div class="pt-2 md:px-4 px-2">
        <UTabs
            :ui="{
                list: {
                    base: 'relative flex whitespace-nowrap max-w-xl',
                },
            }"
            :items="items"
        >
            <template #board>
                <Board />
            </template>
            <template #manage-task>
                <ManageTask />
            </template>
        </UTabs>
    </div>
</template>

<script setup lang="ts">
import Board from "./components/kanban-board.vue";
import ManageTask from "./components/manage-task.vue";

const items = [
    {
        icon: "solar:widget-2-outline",
        label: "Board View",
        slot: "board",
    },
    {
        icon: "solar:clipboard-list-outline",
        label: "Table View",
        slot: "manage-task",
    },
];

definePageMeta({
    layout: "app-layout",
    permission: "view task"
});

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
