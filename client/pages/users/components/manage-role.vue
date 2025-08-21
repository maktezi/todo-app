<template>
    <CrudTable :table-data="tableData" />
</template>

<script setup lang="ts">
import type { Role } from "~/types/codegen/graphql";

import { permissionsPaginate } from "~/graphql/Permission";
import { rolesPaginate, upsertRole, deleteRole } from "~/graphql/Role";

import { columns, status } from "../data/role/columns";
import { schema } from "../data/role/schema";

const permissionSearch = useSearchQueryOptions(permissionsPaginate, {
    queryKey: "permissionsPaginate",
});
const formSchema = computed(() =>
    schema({
        permission: {
            onSearch: permissionSearch.debouncedSearch,
            options: permissionSearch.queryOptions,
        },
    }),
);
const zodSchema = computed(() => formZodSchema(formSchema.value));

const tableData = useTableData<Role>(
    {
        icon: "solar:key-outline",
        permission: "role",
        title: "Roles",
    },
    {
        delete: deleteRole,
        paginate: rolesPaginate,
        upsert: upsertRole,
    },
    {
        columns,
        filters: status,
        formSchema: formSchema.value,
        getFormState: (role?: Role) => {
            const permissionIds =
                role?.permissions?.map((perm) => perm?.id) || [];
            permissionSearch.initializeOptions();
            return role
                ? {
                      id: role.id,
                      name: role.name,
                      permissions: permissionIds,
                  }
                : {
                      id: undefined,
                      name: "",
                      permissions: [],
                  };
        },
        optionLoading: permissionSearch.loadingOptions,
        prepareSubmitData: (data, selectedRole?: Role) => ({
            ...data,
            id: selectedRole?.id,
            permissions: {
                sync: Array.isArray(data.permissions)
                    ? data.permissions
                    : [data.permissions],
            },
        }),
        zodSchema: zodSchema.value,
    },
);
</script>
