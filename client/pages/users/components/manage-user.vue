<template>
    <CrudTable :table-data="tableData" />
</template>

<script setup lang="ts">
import type { User } from "~/types/codegen/graphql";

import { rolesPaginate } from "~/graphql/Role";
import {
    usersPaginate,
    upsertUser,
    deleteUser,
    updateUserStatus,
} from "~/graphql/User";

import { columns, filters } from "../data/user/columns";
import { schema } from "../data/user/schema";

const roleSearch = useSearchQueryOptions(rolesPaginate, {
    queryKey: "rolesPaginate",
});
const formSchema = computed(() =>
    schema({
        role: {
            onSearch: roleSearch.debouncedSearch,
            options: roleSearch.queryOptions,
        },
    }),
);
const zodSchema = computed(() => formZodSchema(formSchema.value));

const tableData = useTableData<User>(
    {
        hasStatus: true,
        icon: "solar:users-group-rounded-outline",
        permission: "user",
        title: "Users",
    },
    {
        delete: deleteUser,
        paginate: usersPaginate,
        updateStatus: updateUserStatus,
        upsert: upsertUser,
    },
    {
        columns,
        customActions: [
            {
                color: () => "orange",
                condition: () => true,
                icon: () => "solar:file-download-broken",
                onClick: (row: User) => {
                    console.log("User Row Data:", row);
                    useToast().add({
                        color: "green",
                        description: `Row data for ${row.name} logged to console`,
                        title: "Custom Action Triggered",
                    });
                },
                tooltip: (row: User) => `Log the Data ${row.name}`,
            },
        ],
        defaultViewModal: true,
        filters,
        formSchema: formSchema.value,
        getFormState: (user?: User) => {
            const roleIds = user?.roles?.map((role) => role?.id) || [];
            roleSearch.initializeOptions();
            return user
                ? {
                      email: user.email || "",
                      first_name: user.first_name || "",
                      id: user.id,
                      is_active: user.is_active || false,
                      last_name: user.last_name || "",
                      middle_name: user.middle_name || "",
                      password: "",
                      phone: user.phone || "",
                      roles: roleIds,
                  }
                : {
                      email: "",
                      first_name: "",
                      id: undefined,
                      is_active: false,
                      last_name: "",
                      middle_name: "",
                      password: "",
                      phone: "",
                      roles: [],
                  };
        },
        optionLoading: roleSearch.loadingOptions,
        prepareSubmitData: (data, selectedUser?: User) => ({
            ...data,
            id: selectedUser?.id,
            password: data.password || selectedUser?.password,
            roles: {
                sync: Array.isArray(data.roles) ? data.roles : [data.roles],
            },
        }),
        zodSchema: zodSchema.value,
    },
);
</script>
