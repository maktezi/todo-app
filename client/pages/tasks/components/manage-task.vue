<template>
    <div>
        <CrudTable :table-data="tableData" />

        <ModalConfirm
            v-model:is-open="isConfirmModal"
            :loading="modalLoading"
            label="Update"
            :description="`Confirm task's status to ${selectedStatus}?`"
            icon="i-heroicons-exclamation-triangle"
            :action="updateStatus"
            color="blue"
        />
    </div>
</template>

<script setup lang="ts">
import type { SqlOperator, Task } from "~/types/codegen/graphql";

import { deleteTask, tasksPaginate, upsertTask } from "~/graphql/Task";
import { TaskPriority, TaskStatus } from "~/pages/tasks/data/types";
import { formatDateTimeForGraphQL } from "~/utils/helpers";

import { columns, filters } from "../data/columns";
import { schema } from "../data/schema";

const auth = useAuthStore();
const toast = useToast();
const selectedRow = ref<Task | null>(null);
const selectedStatus = ref<string | null>(null);
const isConfirmModal = ref(false);
const modalLoading = ref(false);

// Form schema
const formSchema = computed(() => schema());
const zodSchema = computed(() => formZodSchema(formSchema.value));

// Initialize table data
const tableData = useTableData<Task>(
    {
        icon: "solar:documents-broken",
        permission: "task",
        title: "Tasks",
    },
    {
        delete: deleteTask,
        paginate: tasksPaginate,
        upsert: upsertTask,
    },
    {
        columns,
        customActions: [
            {
                color: () => "gray",
                condition: () => auth.can("edit task"),
                icon: () => "solar:close-square-broken",
                onClick: (row: Task) =>
                    confirmUpdateStatus(row, TaskStatus.PENDING),
                tooltip: () => "Update Task to Pending",
            },
            {
                color: () => "emerald",
                condition: () => auth.can("edit task"),
                icon: () => "solar:square-arrow-right-up-broken",
                onClick: (row: Task) =>
                    confirmUpdateStatus(row, TaskStatus.COMPLETED),
                tooltip: () => "Update Task to Completed",
            },
        ],
        defaultViewModal: true,
        filters,
        formSchema: formSchema.value,
        getFormState: (row?: Task) => {
            return row
                ? {
                      description: row.description || "",
                      id: row.id,
                      order: row.order ?? null,
                      priority: row.priority || "",
                      status: row.status || "",
                      title: row.title,
                  }
                : {
                      description: "",
                      id: undefined,
                      order: null,
                      priority: "",
                      status: "",
                      title: "",
                  };
        },
        prepareSubmitData: (data, selectedRow?: Task) => ({
            ...data,
            createdBy: data.createdBy || { connect: auth.user?.id },
            id: selectedRow?.id,
            order: data.order ?? 1,
            priority: data.priority || TaskPriority.LOW,
            status: data.status || TaskStatus.PENDING,
            updatedBy: { connect: auth.user?.id },
        }),
        whereConditions: conditions(),
        zodSchema: zodSchema.value,
    },
);

function conditions() {
    const isAdmin = auth.user?.roles?.some((r) => r?.name === "Admin");
    const requiredPermissions = [
        "view task",
        "create task",
        "edit task",
        "delete task",
        "approve task",
    ];
    const hasPermissions = requiredPermissions.every((perm) => auth.can(perm));
    if (isAdmin || hasPermissions) return undefined;

    return {
        column: "CREATED_BY",
        operator: "EQ" as SqlOperator,
        value: auth.user?.id,
    };
}

function confirmUpdateStatus(row: Task, status: string) {
    selectedRow.value = row;
    selectedStatus.value = status;
    isConfirmModal.value = true;
}

async function updateStatus() {
    if (!selectedRow.value || !selectedStatus.value) return;
    try {
        const { mutate } = useMutation(tableData.upsert);
        await mutate({
            input: {
                id: selectedRow.value.id,
                status: selectedStatus.value,
                updated_at:
                    selectedRow.value.updated_at ||
                    formatDateTimeForGraphQL(new Date()),
                updatedBy: { connect: auth.user?.id },
            },
        });
        toast.add({
            color: "green",
            icon: "solar:check-circle-broken",
            title: `Status updated to ${selectedStatus.value}`,
        });
    } catch (e) {
        toast.add({
            color: "red",
            icon: "solar:close-circle-broken",
            title: e.message || "Failed to update status.",
        });
        console.error(e);
    } finally {
        isConfirmModal.value = false;
        selectedStatus.value = null;
    }
}
</script>
