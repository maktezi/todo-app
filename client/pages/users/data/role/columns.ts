import { UBadge } from "#components";
import { ShieldCheck, User } from "lucide-vue-next";

import type { Column } from "~/components/table/types";
import type { Role } from "~/types/codegen/graphql";

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
        key: "name",
        label: "Name",
        render: (row) => {
            const Icon = roleIconMap[row.name] || User;

            return h(
                UBadge,
                {
                    color: colorMap[row.name] || "gray",
                    label: row.name,
                    size: "sm",
                    variant: "solid",
                },
                {
                    default: () =>
                        h("div", { class: "flex items-center space-x-1" }, [
                            h(Icon, { class: "w-3 h-3" }),
                            h("span", null, row.name),
                        ]),
                },
            );
        },
        sortable: true,
    },
    {
        key: "permissions",
        label: "Permissions",
        render: (row: Role) => {
            const Icon = ShieldCheck;

            if (row.name === "Admin") {
                return h(
                    UBadge,
                    {
                        color: "green",
                        label: "No limits",
                        size: "sm",
                        variant: "subtle",
                    },
                    {
                        default: () =>
                            h("div", { class: "flex items-center space-x-1" }, [
                                h(Icon, { class: "w-3 h-3" }),
                                h("span", null, "All Permissions"),
                            ]),
                    },
                );
            }

            return h(
                "div",
                { class: "flex flex-wrap gap-1" },
                row.permissions?.map((permission) =>
                    h(
                        UBadge,
                        {
                            color: "gray",
                            label: permission?.name,
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
                                        h("span", null, permission?.name),
                                    ],
                                ),
                        },
                    ),
                ),
            );
        },
        sortable: true,
    },
    // {
    //     key: "guard_name",
    //     label: "Guard Name",
    //     sortable: true,
    // },
    // {
    //     key: "created_at",
    //     label: "Created At",
    //     render: (row) => h("div", getFriendlyDate(row.created_at)),
    //     sortable: true,
    // },
    {
        key: "updated_at",
        label: "Updated At",
        render: (row) => h("div", getFriendlyDate(row.updated_at)),
        sortable: true,
    },
    {
        key: "actions",
        label: "Actions",
        sortable: false,
    },
];

// Filters
export const status = [];
