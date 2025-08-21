<template>
    <div>
        <CrudTable :table-data="tableData" />

        <ModalConfirm
            v-model:is-open="isConfirmModal"
            :loading="modalLoading"
            label="Update"
            :description="`Confirm document's status to ${selectedStatus}?`"
            icon="i-heroicons-exclamation-triangle"
            :action="updateDocumentStatus"
            color="blue"
        />
    </div>
</template>

<script setup lang="ts">
import type { SqlOperator, Document } from "~/types/codegen/graphql";

import {
    deleteDocument,
    documentsPaginate,
    upsertDocument,
} from "~/graphql/Document";
import { formatDateTimeForGraphQL, generateCustomId } from "~/utils/helpers";

import { columns, filters } from "../data/columns";
import { schema } from "../data/schema";

const auth = useAuthStore();
const toast = useToast();
const selectedRow = ref<Document | null>(null);
const selectedStatus = ref<string | null>(null);
const isConfirmModal = ref(false);
const modalLoading = ref(false);

// Form schema
const formSchema = computed(() => schema());
const zodSchema = computed(() => formZodSchema(formSchema.value));

// Initialize table data
const tableData = useTableData<Document>(
    {
        icon: "solar:documents-broken",
        permission: "document",
        title: "Documents",
    },
    {
        delete: deleteDocument,
        paginate: documentsPaginate,
        upsert: upsertDocument,
    },
    {
        columns,
        customActions: [
            {
                color: () => "gray",
                condition: () => auth.can("pending document"),
                icon: () => "solar:clock-square-broken",
                onClick: (row: Document) => confirmUpdateStatus(row, "pending"),
                tooltip: () => "Revert to pending",
            },
            {
                color: () => "green",
                condition: () => auth.can("approve document"),
                icon: () => "solar:check-square-broken",
                onClick: (row: Document) =>
                    confirmUpdateStatus(row, "approved"),
                tooltip: (row: Document) => `Approve ${toTitleCase(row.type)}`,
            },
            {
                color: () => "emerald",
                condition: () => auth.can("release document"),
                icon: () => "solar:square-arrow-right-up-broken",
                onClick: (row: Document) =>
                    confirmUpdateStatus(row, "released"),
                tooltip: (row: Document) => `Release ${toTitleCase(row.type)}`,
            },
            {
                color: () => "orange",
                condition: () => auth.can("revoke document"),
                icon: () => "solar:close-square-broken",
                onClick: (row: Document) => confirmUpdateStatus(row, "revoked"),
                tooltip: (row: Document) => `Revoke ${toTitleCase(row.type)}`,
            },
        ],
        defaultViewModal: true,
        filters,
        formSchema: formSchema.value,
        getFormState: (row?: Document) => {
            return row
                ? {
                      category: row.category,
                      doc_no: row.doc_no,
                      id: row.id,
                      issued_at: row.issued_at,
                      requested_at: row.requested_at,
                      status: row.status,
                      type: row.type,
                      valid_until: row.valid_until,
                  }
                : {
                      category: "",
                      doc_no: "",
                      id: undefined,
                      issued_at: "",
                      requested_at: "",
                      status: "",
                      type: "",
                      valid_until: "",
                  };
        },
        prepareSubmitData: (data, selectedRow?: Document) => ({
            ...data,
            createdBy: selectedRow?.createdBy || { connect: auth.user?.id },
            doc_no: selectedRow?.doc_no || generateCustomId("Doc"),
            id: selectedRow?.id,
            issued_at: data.issued_at
                ? formatDateTimeForGraphQL(String(data.issued_at))
                : null,
            requested_at: data.requested_at
                ? formatDateTimeForGraphQL(String(data.requested_at))
                : null,
            status:
                selectedRow?.status === "revoked"
                    ? "revoked"
                    : !data.valid_until
                      ? undefined
                      : new Date(String(data.valid_until)).getTime() >
                          Date.now()
                        ? data.status
                        : "expired",
            updatedBy: selectedRow?.updatedBy || { connect: auth.user?.id },
            valid_until: data.valid_until
                ? formatDateTimeForGraphQL(String(data.valid_until))
                : null,
        }),
        whereConditions: conditions(),
        zodSchema: zodSchema.value,
    },
);

function conditions() {
    const isAdmin = auth.user?.roles?.some((r) => r?.name === "Admin");
    const requiredPermissions = [
        "view document",
        "create document",
        "edit document",
        "delete document",
        "approve document",
        "pending document",
        "release document",
        "revoke document",
    ];
    const hasPermissions = requiredPermissions.every((perm) => auth.can(perm));
    if (isAdmin || hasPermissions) return undefined;

    return {
        column: "CREATED_BY",
        operator: "EQ" as SqlOperator, // TODO: Fix GraphQL enum issue
        value: auth.user?.id,
    };
}

function confirmUpdateStatus(row: Document, status: string) {
    selectedRow.value = row;
    selectedStatus.value = status;
    isConfirmModal.value = true;
}

async function updateDocumentStatus() {
    if (!selectedRow.value || !selectedStatus.value) return;
    try {
        const { mutate } = useMutation(tableData.upsert);
        await mutate({
            input: {
                id: selectedRow.value.id,
                issued_at:
                    selectedStatus.value === "released"
                        ? formatDateTimeForGraphQL(new Date())
                        : selectedRow.value.issued_at,
                status: selectedStatus.value,
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
