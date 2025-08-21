import { UBadge } from "#components";
import { ShieldCheck } from "lucide-vue-next";

import type { Permission } from "~/types/codegen/graphql";

import { colorMap } from "~/utils/helpers";

export const columns = [
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
        key: "permissions",
        label: "Permissions",
        render: (row: Permission) => {
            const Icon = ShieldCheck;

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
        key: "guard_name",
        label: "Guard Name",
        sortable: true,
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
        render: (row: Permission) => h("div", getFriendlyDate(row.updated_at)),
        sortable: true,
    },
    {
        key: "actions",
        label: "Actions",
        sortable: false,
    },
];

export const filter = [];
