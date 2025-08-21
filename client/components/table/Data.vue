<template>
    <div class="relative h-screen flex flex-col">
        <!-- Fixed Header -->
        <div
            class="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700"
        >
            <UCard
                class="w-full"
                :ui="{
                    base: '',
                    ring: '',
                    divide: '',
                    header: { padding: 'p-3' },
                    body: { padding: '' },
                    footer: { padding: '' },
                }"
            >
                <template #header>
                    <slot name="header">
                        <h2
                            class="font-semibold text-xl text-gray-900 dark:text-gray-100 leading-tight"
                        >
                            <slot name="title">Data Table</slot>
                        </h2>
                    </slot>
                </template>

                <div
                    class="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full px-4 py-2 gap-3"
                >
                    <!-- Filters -->
                    <div class="flex items-center gap-1.5 w-full sm:w-auto">
                        <UTooltip text="Go back">
                            <UButton
                                size="2xs"
                                class="rounded-full p-1 mr-2"
                                color="red"
                                variant="outline"
                                @click="navigateTo('/dashboard')"
                            >
                                <Icon name="mdi:arrow-left" size="20" />
                            </UButton>
                        </UTooltip>

                        <USelectMenu
                            v-model="selectedColumns"
                            :options="excludeSelectColumn"
                            multiple
                        >
                            <UButton icon="solar:widget-4-broken" color="gray">
                                Table Columns
                            </UButton>
                        </USelectMenu>
                    </div>

                    <div
                        class="flex flex-wrap gap-2 items-center w-full sm:w-auto"
                    >
                        <UInput
                            v-model="search"
                            icon="solar:magnifer-broken"
                            placeholder="Search"
                            class="w-full sm:w-auto"
                        />

                        <div class="flex gap-2">
                            <USelectMenu
                                v-if="filters.length"
                                v-model="selectedStatus"
                                :options="filters"
                                multiple
                                placeholder="Filters"
                                icon="solar:filter-broken"
                                class="w-32"
                            />

                            <UButton
                                v-show="
                                    selectedStatus?.length > 0 || search !== ''
                                "
                                icon="solar:filter-broken"
                                color="red"
                                variant="outline"
                                size="xs"
                                :disabled="
                                    search === '' &&
                                    selectedStatus?.length === 0
                                "
                                @click="resetFilters"
                            >
                                Clear
                            </UButton>
                        </div>
                    </div>
                </div>
            </UCard>
        </div>

        <!-- Scrollable Content Area -->
        <div class="flex-1 overflow-auto">
            <UCard
                class="w-full h-full"
                :ui="{
                    base: '',
                    ring: '',
                    divide: 'divide-y divide-gray-200 dark:divide-gray-700',
                    header: { padding: '' },
                    body: {
                        padding: '',
                        base: 'divide-y divide-gray-200 dark:divide-gray-700',
                    },
                    footer: { padding: '' },
                }"
            >
                <!-- Desktop Table View (hidden on mobile) -->
                <div class="hidden md:block">
                    <UTable
                        v-model="selectedRows"
                        v-model:sort="sort"
                        :rows="data"
                        :columns="columnsTable"
                        :loading="loading"
                        sort-asc-icon="i-heroicons-arrow-up"
                        sort-desc-icon="i-heroicons-arrow-down"
                        sort-mode="manual"
                        class="w-full"
                        :ui="{
                            td: { base: 'max-w-[0] truncate' },
                            default: { checkbox: { color: 'gray' as const } },
                        }"
                    >
                        <!-- Dynamic cell renderer -->
                        <template
                            v-for="column in columnsTable"
                            #[`${column.key}-data`]="{ row }"
                        >
                            <template v-if="column.render">
                                <component
                                    :is="getDynamicContent(column, row)"
                                />
                            </template>
                        </template>

                        <template
                            v-if="actions && actions.length > 0"
                            #actions-data="{ row }"
                        >
                            <div class="flex items-center gap-1">
                                <UPopover>
                                    <UButton
                                        color="gray"
                                        trailing-icon="solar:menu-dots-bold-duotone"
                                        variant="ghost"
                                        class="hover:scale-125 p-1 transition-all duration-300"
                                    />

                                    <template #panel>
                                        <div
                                            class="grid grid-cols-2 md:grid-cols-3 gap-3 p-2"
                                        >
                                            <template
                                                v-for="(
                                                    action, index
                                                ) in actions"
                                                :key="index"
                                            >
                                                <template
                                                    v-if="action.condition(row)"
                                                >
                                                    <UTooltip
                                                        :text="
                                                            action.tooltip(row)
                                                        "
                                                    >
                                                        <UButton
                                                            size="2xs"
                                                            :color="
                                                                action.color(
                                                                    row,
                                                                )
                                                            "
                                                            variant="ghost"
                                                            square
                                                            @click="
                                                                action.onClick(
                                                                    row,
                                                                )
                                                            "
                                                        >
                                                            <Icon
                                                                :name="
                                                                    action.icon(
                                                                        row,
                                                                    )
                                                                "
                                                                size="22"
                                                                class="hover:scale-125 transition-all duration-300"
                                                            />
                                                        </UButton>
                                                    </UTooltip>
                                                </template>
                                            </template>
                                        </div>
                                    </template>
                                </UPopover>
                            </div>
                        </template>

                        <!-- Pass through other slots -->
                        <template v-for="(_, slot) in $slots" #[slot]="scope">
                            <slot :name="slot" v-bind="scope" />
                        </template>

                        <template #loading-state>
                            <div
                                class="flex items-center justify-center h-[calc(50vh-10px)]"
                            >
                                <SpinnerLoader size="80" color="#44c977" />
                            </div>
                        </template>
                    </UTable>
                </div>

                <!-- Mobile Card View -->
                <div class="block md:hidden">
                    <div
                        v-if="loading"
                        class="flex items-center justify-center h-[calc(50vh-10px)]"
                    >
                        <SpinnerLoader size="80" color="#44c977" />
                    </div>
                    <template v-else>
                        <div class="space-y-2 p-3">
                            <div
                                v-for="(row, rowIndex) in data"
                                :key="rowIndex"
                                class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200 overflow-hidden"
                            >
                                <!-- Compact Header -->
                                <div
                                    class="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-800"
                                >
                                    <div
                                        class="flex items-center justify-center gap-2"
                                    >
                                        <div v-if="hasSelectableRows">
                                            <UCheckbox
                                                :model-value="
                                                    isRowSelected(row as Row)
                                                "
                                                color="primary"
                                                @change="
                                                    toggleRowSelection(
                                                        row as Row,
                                                    )
                                                "
                                            />
                                        </div>

                                        <div class="flex items-center gap-2">
                                            <div
                                                class="size-2 bg-primary-500 rounded-full"
                                            />
                                            <div
                                                class="font-medium text-gray-900 dark:text-gray-100"
                                            >
                                                {{
                                                    getPrimaryIdentifier(
                                                        row as Row,
                                                    )
                                                }}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Compact Actions -->
                                    <div
                                        v-if="actions && actions.length > 0"
                                        class="bg-gray-50 rounded-lg dark:bg-gray-800 p-1 flex justify-center border-t border-gray-100 dark:border-gray-800"
                                    >
                                        <div class="flex gap-2">
                                            <template
                                                v-for="(
                                                    action, index
                                                ) in actions"
                                                :key="index"
                                            >
                                                <template
                                                    v-if="action.condition()"
                                                >
                                                    <UTooltip
                                                        :text="
                                                            action.tooltip(row)
                                                        "
                                                    >
                                                        <UButton
                                                            size="sm"
                                                            :color="
                                                                action.color(
                                                                    row,
                                                                )
                                                            "
                                                            variant="ghost"
                                                            square
                                                            class="hover:scale-105 transition-transform duration-200"
                                                            @click="
                                                                action.onClick(
                                                                    row,
                                                                )
                                                            "
                                                        >
                                                            <Icon
                                                                :name="
                                                                    action.icon(
                                                                        row,
                                                                    )
                                                                "
                                                                size="18"
                                                            />
                                                        </UButton>
                                                    </UTooltip>
                                                </template>
                                            </template>
                                        </div>
                                    </div>
                                </div>

                                <!-- Compact Body -->
                                <div class="px-4 py-2 space-y-1">
                                    <div
                                        v-for="column in visibleColumnsForMobile"
                                        :key="column.key"
                                        class="flex justify-between items-center py-1"
                                    >
                                        <span
                                            class="text-xs text-gray-500 dark:text-gray-400 font-medium"
                                        >
                                            {{ column.label }}
                                        </span>
                                        <div
                                            class="text-sm text-gray-900 dark:text-gray-100 font-medium ml-2 truncate max-w-[60%] text-right"
                                        >
                                            <template v-if="column.render">
                                                <component
                                                    :is="
                                                        getDynamicContent(
                                                            column,
                                                            row,
                                                        )
                                                    "
                                                />
                                            </template>
                                            <template v-else>
                                                {{ row[column.key] }}
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Compact Empty State -->
                        <div v-if="data.length === 0" class="p-8 text-center">
                            <div
                                class="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl inline-block mb-3"
                            >
                                <Icon
                                    name="i-heroicons-inbox"
                                    class="mx-auto h-8 w-8 text-gray-400"
                                />
                            </div>
                            <h3
                                class="font-medium text-gray-900 dark:text-gray-100 mb-1"
                            >
                                No results found
                            </h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                Try adjusting your search or filter.
                            </p>
                        </div>
                    </template>
                </div>
            </UCard>
        </div>

        <!-- Fixed Footer -->
        <div
            class="sticky bottom-0 z-10 border-t border-gray-200 dark:border-gray-700 rounded-lg"
        >
            <UCard
                class="w-full"
                :ui="{
                    base: '',
                    ring: '',
                    divide: '',
                    header: { padding: '' },
                    body: { padding: '' },
                    footer: { padding: 'p-2' },
                }"
            >
                <template #footer>
                    <div
                        class="flex flex-col sm:flex-row justify-between items-center gap-4"
                    >
                        <div class="flex items-center gap-1.5">
                            <USelect
                                v-model="pageCount"
                                :options="[10, 20, 50, 100]"
                                class="me-2 w-20"
                                size="xs"
                            />

                            <div>
                                <span
                                    class="text-xs leading-5 text-gray-500 dark:text-gray-400"
                                >
                                    Showing
                                    <span>{{ pageFrom }}</span>
                                    to
                                    <span>{{ pageTo }}</span>
                                    of
                                    <span>{{ pageTotal }}</span>
                                </span>
                            </div>
                        </div>

                        <UPagination
                            v-model="page"
                            :page-count="pageCount"
                            :total="pageTotal"
                            :ui="{
                                wrapper: 'flex items-center gap-1',
                                rounded:
                                    '!rounded-full min-w-[32px] justify-center',
                                default: {
                                    activeButton: {
                                        variant: 'outline',
                                    },
                                },
                            }"
                        />
                    </div>
                </template>
            </UCard>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { h } from "vue";

import type {
    Column,
    FilterOption,
    Row,
    Sort,
    TableAction,
} from "~/components/table/types";

import SpinnerLoader from "~/components/ui/SpinnerLoader.vue";

const props = defineProps({
    actions: {
        default: () => [],
        type: Array as PropType<TableAction[]>,
    },
    columns: {
        required: true,
        type: Array as PropType<Column[]>,
    },
    data: {
        required: true,
        type: Array,
    },
    filters: {
        default: () => [],
        type: Array as PropType<FilterOption[]>,
    },
    loading: {
        default: false,
        type: Boolean,
    },
    primaryIdentifierKey: {
        default: "",
        type: String,
    },
    showDeleteAction: {
        default: true,
        type: Boolean,
    },
    showEditAction: {
        default: true,
        type: Boolean,
    },
    totalItems: {
        required: true,
        type: Number,
    },
});

const emit = defineEmits([
    "update:selectedRows",
    "update:sort",
    "update:page",
    "update:pageCount",
    "update:search",
    "update:selectedStatus",
    "update:selectedColumns",
    "resetFilters",
    "select",
    "edit",
    "delete",
]);

const getDynamicContent = (column: Column, row: never) => {
    if (!column.render) return null;

    const result = column.render(row);
    if (typeof result === "object" && result !== null) {
        return result;
    }

    return h("span", {}, String(result));
};

// Get a primary identifier for the card header
const getPrimaryIdentifier = (row: Row) => {
    // Use specified primary key if provided
    if (
        props.primaryIdentifierKey &&
        row[props.primaryIdentifierKey] !== undefined
    ) {
        return row[props.primaryIdentifierKey];
    }

    // Otherwise use first non-select column
    const firstColumn = visibleColumnsForMobile.value[0];
    if (firstColumn && row[firstColumn.key] !== undefined) {
        if (firstColumn.render) {
            // If there's a renderer, try to get text content
            const result = firstColumn.render(row);
            if (typeof result === "string") return result;
            // For complex rendered content, fall back to the raw value
            return row[firstColumn.key] || "Item";
        }
        return row[firstColumn.key];
    }

    // Fallback
    return "Item";
};

const selectedColumns = defineModel<Column[]>("selectedColumns");
const columnsTable = computed(() =>
    props.columns.filter((column) => selectedColumns.value?.includes(column)),
);
const excludeSelectColumn = computed(() =>
    props.columns.filter((v) => v.key !== "select"),
);

// For mobile view - limit to most important columns to avoid cluttered cards
const visibleColumnsForMobile = computed(() => {
    const columns =
        selectedColumns.value?.filter(
            (column) => column.key !== "select" && column.key !== "actions",
        ) || [];

    // Limit to most important columns (assuming first few are most important)
    // We can make this configurable with a prop if needed
    return columns.slice(0, 5);
});

const hasSelectableRows = computed(() =>
    props.columns.some((column) => column.key === "select"),
);

// Selection handling
const selectedRows = defineModel<Row[]>("selectedRows");
// const select = (row: Row) => emit("select", row);

const isRowSelected = (row: Row) => {
    return selectedRows.value?.includes(row);
};

const toggleRowSelection = (row: Row) => {
    if (!selectedRows.value) return;

    const index = selectedRows.value.indexOf(row);
    if (index === -1) {
        selectedRows.value = [...selectedRows.value, row];
    } else {
        selectedRows.value = selectedRows.value.filter((r) => r !== row);
    }
};

// Pagination
const sort = defineModel<Sort>("sort");
const page = defineModel<number>("page", { default: 1 });
const pageCount = defineModel<number>("pageCount", { default: 0 });
const pageTotal = computed(() => props.totalItems);
const pageFrom = computed(() => {
    if (!page.value || !pageCount.value) return 1;
    return (page.value - 1) * pageCount.value + 1;
});
const pageTo = computed(() => {
    if (!page.value || !pageCount.value) return pageCount.value;
    return Math.min(page.value * pageCount.value, pageTotal.value);
});

// Filters
const search = defineModel<string>("search", { default: "" });
const selectedStatus = defineModel<string | string[]>("selectedStatus", {
    default: [],
});
const resetFilters = () => emit("resetFilters");
</script>
