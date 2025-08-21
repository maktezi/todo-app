import { UBadge } from "#components";
import { User } from "lucide-vue-next";

import type { Column } from "~/components/table/types";
import type { User as UserType } from "~/types/codegen/graphql";

import { colorMap, roleIconMap } from "~/utils/helpers";

export const columns: Column[] = [
    {
        class: "w-2",
        key: "select",
    },
    {
        key: "id",
        label: "#",
        sortable: true,
    },
    {
        class: "w-52",
        key: "roles",
        label: "Role",
        render: (row: UserType) => {
            return h("div", { class: "flex items-center space-x-2" }, [
                ...row.roles.map((role) => {
                    const Icon = roleIconMap[role!.name] || User;

                    return h(
                        UBadge,
                        {
                            color: colorMap[role!.name] || "gray",
                            label: role!.name,
                            size: "sm",
                            variant: "solid",
                        },
                        {
                            default: () =>
                                h(
                                    "div",
                                    { class: "flex items-center space-x-1" },
                                    [
                                        h(Icon, { class: "w-3 h-3" }),
                                        h("span", null, role!.name),
                                    ],
                                ),
                        },
                    );
                }),
            ]);
        },
        sortable: false,
    },
    {
        key: "name",
        label: "Name",
        sortable: true,
    },
    {
        key: "email",
        label: "Email",
        render: (row: UserType) =>
            h("div", { class: "flex items-center space-x-2" }, [
                h(
                    "a",
                    {
                        class: "text-blue-600 italic cursor-pointer",
                        onClick: () => copyToClipboard("email", row.email),
                    },
                    row.email,
                ),
            ]),
        sortable: true,
    },
    {
        key: "phone",
        label: "Phone",
        render: (row: UserType) =>
            h("div", { class: "flex items-center space-x-2" }, [
                h(
                    "a",
                    {
                        class: "text-blue-600 text-xs cursor-pointer",
                        onClick: () =>
                            copyToClipboard("phone", row.phone || "N/A"),
                    },
                    row.phone || "N/A",
                ),
            ]),
        sortable: false,
    },
    {
        key: "is_active",
        label: "Status",
        render: (row: UserType) =>
            h(UBadge, {
                color: row.is_active ? "green" : "gray",
                label: row.is_active ? "Active" : "Inactive",
                size: "sm",
                variant: row.is_active ? "subtle" : "solid",
            }),
        sortable: false,
    },
    // {
    //     key: "created_at",
    //     label: "Created At",
    //     render: (row) => h("div", getFriendlyDate(row.created_at)),
    //     sortable: true,
    // },
    {
        key: "updated_at",
        label: "Updated At",
        render: (row: UserType) => h("div", getFriendlyDate(row.updated_at)),
        sortable: true,
    },
    {
        key: "actions",
        label: "Actions",
        sortable: false,
    },
];

// Filters
export const filters = [
    {
        key: "is_active",
        label: "Inactive",
        value: "false", // boolean values is handles by the backend
    },
    {
        key: "is_active",
        label: "Active",
        value: "true", // boolean values is handles by the backend
    },
];
