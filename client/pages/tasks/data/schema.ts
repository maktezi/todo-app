import { z } from "zod";

import type { FormSchema } from "~/types/fields";
import type { formZodSchema } from "~/utils/helpers";

import { TaskPriority } from "~/pages/tasks/data/types";

export const schema = (): FormSchema => ({
    fields: [
        {
            class: "col-span-full",
            label: "Title",
            name: "title",
            type: "text",
            validation: z.string().min(1, "Title is required"),
        },
        {
            class: "col-span-full",
            label: "Description",
            name: "description",
            type: "textarea",
            validation: z.string().min(1, "Description is required"),
        },
        {
            class: "col-span-full",
            label: "Task Priority",
            name: "priority",
            options: [
                {
                    label: "Low",
                    value: TaskPriority.LOW,
                },
                {
                    label: "Medium",
                    value: TaskPriority.MEDIUM,
                },
                {
                    label: "High",
                    value: TaskPriority.HIGH,
                },
            ],
            type: "select",
            validation: z.string().min(1, "Task priority is required"),
        },
    ],
});

export type Schema = z.infer<ReturnType<typeof formZodSchema>>;
