import type { Maybe } from "@envelop/types";

import { UBadge } from "#components";

import type { Column } from "~/components/table/types";
import type { Task } from "~/types/codegen/graphql";

import { TaskPriority, TaskStatus } from "~/pages/tasks/data/types";

export const columns: Column[] = [
    {
        class: "w-2",
        key: "select",
    },
    {
        class: "w-2",
        key: "id",
        label: "#",
        sortable: true,
    },
    {
        class: "w-52",
        key: "title",
        label: "Title",
        render: (row: Task) => {
            return h(
                UBadge,
                {
                    color: "gray",
                    label: row.title,
                    size: "sm",
                    variant: "solid",
                },
                {
                    default: () =>
                        h("div", { class: "flex items-center space-x-1" }, [
                            h("span", null, row.title),
                        ]),
                },
            );
        },
        sortable: true,
    },
    {
        key: "description",
        label: "Description",
        sortable: true,
    },
    {
        key: "status",
        label: "Status",
        render: (row: Task) =>
            h(UBadge, {
                color:
                    row.status ===
                    (TaskStatus.PENDING as Maybe<TaskStatus> | undefined)
                        ? "gray"
                        : row.status ===
                            (TaskStatus.COMPLETED as
                                | Maybe<TaskStatus>
                                | undefined)
                          ? "emerald"
                          : "gray",
                label:
                    row.status ===
                    (TaskStatus.PENDING as Maybe<TaskStatus> | undefined)
                        ? "Pending"
                        : row.status ===
                            (TaskStatus.COMPLETED as
                                | Maybe<TaskStatus>
                                | undefined)
                          ? "Completed"
                          : "Pending",
                size: "sm",
                variant: "subtle",
            }),
        sortable: true,
    },
    {
        key: "priority",
        label: "Priority",
        render: (row: Task) =>
            h(UBadge, {
                color:
                    row.priority ===
                    (TaskPriority.LOW as Maybe<TaskPriority> | undefined)
                        ? "emerald"
                        : row.priority ===
                            (TaskPriority.MEDIUM as
                                | Maybe<TaskPriority>
                                | undefined)
                          ? "yellow"
                          : row.priority ===
                              (TaskPriority.HIGH as
                                  | Maybe<TaskPriority>
                                  | undefined)
                            ? "red"
                            : "gray",
                label:
                    row.priority ===
                    (TaskPriority.LOW as Maybe<TaskPriority> | undefined)
                        ? "Low"
                        : row.priority ===
                            (TaskPriority.MEDIUM as
                                | Maybe<TaskPriority>
                                | undefined)
                          ? "Medium"
                          : row.priority ===
                              (TaskPriority.HIGH as
                                  | Maybe<TaskPriority>
                                  | undefined)
                            ? "High"
                            : "Pending",
                size: "sm",
                variant: "subtle",
            }),
        sortable: true,
    },
    {
        key: "createdBy",
        label: "Created By",
        render: ({ createdBy }) => {
            const auth = useAuthStore();
            const isCurrentUser = createdBy?.id === auth.user?.id;
            return h(
                "div",
                isCurrentUser ? "Me" : (createdBy?.name ?? "Unknown"),
            );
        },
        sortable: true,
    },
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

export const filters = [
    {
        key: "status",
        label: "Pending",
        value: "pending",
    },
    {
        key: "status",
        label: "Completed",
        value: "completed",
    },
    {
        key: "priority",
        label: "Low",
        value: "low",
    },
    {
        key: "priority",
        label: "Medium",
        value: "medium",
    },
    {
        key: "priority",
        label: "High",
        value: "high",
    },
];
