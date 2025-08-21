<template>
    <div class="flex flex-col items-center p-2 h-[calc(100vh-100px)]">
        <div
            class="w-full max-w-[1600px] border border-gray-100 dark:border-gray-700 rounded-lg flex flex-col h-[calc(100vh-85px)]"
        >
            <TableData
                v-model:selected-rows="selectedRows"
                v-model:sort="sort"
                v-model:page="page"
                v-model:page-count="pageCount"
                v-model:search="search"
                v-model:selected-status="selectedFilters"
                v-model:selected-columns="selectedColumns"
                :columns="tableData.columns"
                :data="data"
                :loading="loading"
                :filters="tableData.filters || []"
                :total-items="pageTotal"
                :actions="computedActions"
                class="flex flex-col h-full overflow-auto"
                @reset-filters="resetFilters"
                @select="select"
            >
                <template #header>
                    <div class="flex w-full items-center justify-between pt-2">
                        <div class="flex items-center gap-2">
                            <Icon
                                :name="tableData.icon"
                                class="text-gray-900 mr-2 dark:text-emerald-500"
                                size="30"
                            />
                            <h2
                                class="font-semibold text-xl text-gray-900 dark:text-gray-100 leading-tight"
                            >
                                {{ tableData.title }}
                            </h2>
                        </div>
                        <div class="flex gap-2">
                            <template
                                v-if="auth.can(tableData.permissions.create)"
                            >
                                <UTooltip :text="`Add ${tableData.singular}`">
                                    <UButton
                                        class="hover:bg-transparent hover:scale-110 transition-all duration-300 p-1"
                                        icon="solar:add-square-broken"
                                        variant="ghost"
                                        size="xl"
                                        @click="openAddModal"
                                    />
                                </UTooltip>
                            </template>
                            <UTooltip text="Refetch Data">
                                <UButton
                                    class="hover:bg-transparent hover:scale-110 rounded-full transition-all duration-300 p-1"
                                    :style="`transform: rotate(${rotationRefetch}deg);`"
                                    icon="solar:refresh-bold"
                                    variant="ghost"
                                    size="xl"
                                    @click="handleRefetch"
                                />
                            </UTooltip>
                        </div>
                    </div>
                </template>
            </TableData>
        </div>

        <!-- Modals -->
        <ModalForm
            v-model:is-open="isOpen"
            :title="`${tableData.singular} Form`"
            :form-schema="tableData.formSchema"
            :zod-schema="tableData.zodSchema"
            :state="formState"
            :on-submit="onSubmit"
            :loading="modalLoading"
            :option-loading="tableData.optionLoading"
            :is-fullscreen="tableData.isFormFullscreen"
        />

        <ModalView
            v-if="tableData.defaultViewModal"
            v-model:is-open="isViewModal"
            :title="`View ${tableData.singular}`"
            :form-schema="tableData.formSchema"
            :state="viewState"
            :show-edit-button="auth.can(tableData.permissions.edit)"
            @edit-clicked="handleEditFromView"
        />

        <ModalConfirm
            v-model:is-open="isDeleteModal"
            :loading="modalLoading"
            label="Delete"
            :description="`Are you sure you want to delete this ${tableData.singular.toLowerCase()}?`"
            icon="i-heroicons-exclamation-triangle"
            :action="() => handleDelete(selectedItem.id)"
            color="red"
        />

        <ModalConfirm
            v-if="tableData.hasStatus"
            v-model:is-open="isChangeStatusModal"
            :loading="modalLoading"
            label="Switch Status"
            description="Confirm switch status?"
            icon="i-heroicons-information-circle"
            :action="() => handleStatusChange(selectedItem.id)"
            color="blue"
        />
    </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import type { DocumentNode } from "@apollo/client";
// eslint-disable-next-line vue/prefer-import-from-vue
import type { UnwrapRefSimple } from "@vue/reactivity";
import type { FormSubmitEvent } from "#ui/types";
import type { ZodSchema } from "zod";

import { useDebounce } from "@vueuse/shared";

import type {
    Column,
    FilterOption,
    TableAction,
} from "~/components/table/types";
import type { WhereConditions } from "~/types/codegen/graphql";
import type { FormSchema } from "~/types/fields";

interface TableData<T extends Record<string, unknown>> {
    tableData: {
        // Config
        title: string;
        singular: string;
        icon: string;
        permissions: {
            view: string;
            create: string;
            edit: string;
            delete: string;
            updateStatus?: string;
        };
        hasStatus?: boolean;

        // Operations
        query: DocumentNode;
        upsert: DocumentNode;
        delete: DocumentNode;
        updateStatus?: <TData = unknown>(params: {
            id: unknown;
            status: boolean;
        }) => TData;
        getFormState: (item?: T) => Record<string, unknown>;
        graphQLMutation: any;
        prepareSubmitData: (
            data: Record<string, unknown>,
            selectedItem?: T,
        ) => Record<string, unknown>;

        // UI
        columns: Column[];
        filters?: FilterOption[];
        whereConditions?: WhereConditions | {};
        formSchema: FormSchema;
        zodSchema?: ZodSchema;

        // Optional
        hideDefaultActions?: boolean;
        isFormFullscreen?: boolean;
        optionLoading?: Ref<boolean, boolean> | boolean;
        defaultViewModal?: boolean;
        customActions?: TableAction[];
    };
}

const props = defineProps<TableData<T>>();
const actions = computed(() => props.tableData.customActions ?? []);

const auth = useAuthStore();
const selectedColumns = ref(props.tableData.columns);
const selectedRows = ref<T[]>([]);
const sort = ref({ column: "id", direction: "asc" as "asc" | "desc" });
const page = ref(1);
const pageCount = ref(10);
const search = ref("");
const selectedFilters = ref([]);
const debouncedSearch = useDebounce(search, 500);

const isOpen = ref(false);
const isViewModal = ref(false);
const isDeleteModal = ref(false);
const isChangeStatusModal = ref(false);
const selectedItem = ref<T | null>(null);

const modalLoading = ref(false);
const rotationRefetch = ref(0);
const formState = reactive({});
const viewState = reactive({});

// Computed
const queryVariables = computed(() => {
    return {
        first: Number(pageCount.value),
        page: page.value,
        ...(debouncedSearch.value && { search: debouncedSearch.value }),
        ...(sort.value && { sort: sort.value }),
        ...(selectedFilters.value?.length && { filter: selectedFilters.value }),
        whereConditions: props.tableData.whereConditions || {},
    };
});

const { error, loading, refetch, result } = useQuery(
    props.tableData.query,
    queryVariables,
);

const data = computed(() => {
    if (!result.value) return [];
    const queryKey = Object.keys(result.value)[0];
    return queryKey ? result.value[queryKey].data || [] : [];
});

const pageTotal = computed(() => {
    if (!result.value) return 0;
    const queryKey = Object.keys(result.value)[0];
    return queryKey ? result.value[queryKey].paginatorInfo?.total || 0 : 0;
});

// Actions
const computedActions: Ref<TableAction[]> = computed(() => {
    const customActions = actions.value.map((action) => ({ ...action }));

    if (props.tableData.hideDefaultActions) return customActions;

    return [
        ...customActions,
        ...(props.tableData.hasStatus
            ? [
                  {
                      color: (row: T) => (row.is_active ? "green" : "gray"),
                      condition: () =>
                          auth.can(
                              props.tableData.permissions.updateStatus || "",
                          ),
                      icon: (row: T) =>
                          row.is_active
                              ? "mdi:toggle-switch"
                              : "mdi:toggle-switch-off",
                      onClick: (row: T) => openChangeStatusModal(row),
                      tooltip: (row: T) =>
                          `Switch status to "${row.is_active ? "Inactive" : "Active"}"`,
                  },
              ]
            : []),
        {
            color: () => "yellow",
            condition: () =>
                props.tableData.defaultViewModal &&
                auth.can(props.tableData.permissions.view),
            icon: () => "solar:eye-broken",
            onClick: (row: T) => openViewModal(row),
            tooltip: (row: T) =>
                `View ${props.tableData.singular} ${row.name || row.id}`,
        },
        {
            color: () => "blue",
            condition: () => auth.can(props.tableData.permissions.edit),
            icon: () => "solar:pen-new-square-outline",
            onClick: (row: T) => openEditModal(row),
            tooltip: (row: T) =>
                `Edit ${props.tableData.singular} ${row.name || row.id}`,
        },
        {
            color: () => "red",
            condition: () => auth.can(props.tableData.permissions.delete),
            icon: () => "solar:trash-bin-minimalistic-broken",
            onClick: (row: T) => openDeleteModal(row),
            tooltip: (row: T) =>
                `Delete ${props.tableData.singular} ${row.name || row.id}`,
        },
    ];
});

// Methods
const resetFilters = () => {
    search.value = "";
    selectedFilters.value = [];
    sort.value = { column: "id", direction: "asc" };
};

const select = (row: UnwrapRefSimple<T>) => {
    const index = selectedRows.value.findIndex((item) => item.id === row.id);
    index === -1
        ? selectedRows.value.push(row)
        : selectedRows.value.splice(index, 1);
};

const openModal = (
    item: T | null,
    modal: Ref<boolean>,
    state: Record<string, any>,
) => {
    selectedItem.value = item;
    Object.assign(state, props.tableData.getFormState(item));
    modal.value = true;
};

const openAddModal = () => openModal(null, isOpen, formState);
const openViewModal = (item: T) => openModal(item, isViewModal, viewState);
const openEditModal = (item: T) => openModal(item, isOpen, formState, true);
const openDeleteModal = (item: T) => {
    selectedItem.value = item;
    isDeleteModal.value = true;
};
const openChangeStatusModal = (item: T) => {
    selectedItem.value = item;
    isChangeStatusModal.value = true;
};

const handleEditFromView = () => {
    isViewModal.value = false;
    Object.assign(formState, viewState);
    isOpen.value = true;
};

const handleRefetch = async () => {
    rotationRefetch.value += 360;
    try {
        await refetch();
    } catch (error) {
        console.error(
            `Error refetching ${props.tableData.title.toLowerCase()}:`,
            error,
        );
    }
};

const executeMutation = async (
    action: "delete" | "updateStatus" | "upsert",
    input: any,
    successMessage: string,
    modal: Ref<boolean>,
) => {
    if (!props.tableData[action]) return;

    const { mutate } = useMutation(props.tableData[action]);
    return props.tableData.graphQLMutation(
        action === "updateStatus"
            ? `${props.tableData.singular} Status`
            : props.tableData.singular,
        successMessage,
        modalLoading,
        input,
        {
            auth: auth.user?.id,
            fetch: () => refetch(),
            modal,
            mutation: mutate,
        },
    );
};

const handleDelete = (id: string) =>
    executeMutation("delete", { id }, "deleted", isDeleteModal);
const handleStatusChange = (id: string) =>
    executeMutation(
        "updateStatus",
        { id, is_active: !selectedItem.value?.is_active },
        "updated",
        isChangeStatusModal,
    );

const onSubmit = (event: FormSubmitEvent<any>) => {
    const input = props.tableData.prepareSubmitData(
        event.data,
        selectedItem.value,
    );
    return executeMutation("upsert", { input }, "saved", isOpen);
};

watch(error, (newError) => {
    if (newError)
        console.error(
            `Error fetching ${props.tableData.title.toLowerCase()}:`,
            newError,
        );
});

defineExpose({
    openAddModal,
    openEditModal,
    openViewModal,
    refetch: handleRefetch,
});
</script>
