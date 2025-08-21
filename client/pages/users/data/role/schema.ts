import { z } from "zod";

import type { SearchableFieldHandlers } from "~/components/table/types";
import type { FormSchema } from "~/types/fields";
import type { formZodSchema } from "~/utils/helpers";

export const schema = (handlers: SearchableFieldHandlers): FormSchema => ({
    fields: [
        {
            class: "col-span-full",
            label: "Name",
            name: "name",
            type: "text",
            validation: z.string().min(1, "Name is required"),
        },
        {
            class: "col-span-full",
            label: "Permissions",
            multiple: true,
            name: "permissions",
            onSearch: handlers.permission?.onSearch,
            options: handlers.permission?.options.value ?? [],
            placeholder: "Select Permission/s",
            searchable: true,
            type: "combobox",
            validation: z.union([
                z.string().min(1, "Permission is required"),
                z
                    .array(z.string())
                    .min(1, "At least one permission is required"),
            ]),
        },
    ],
});

export type Schema = z.infer<ReturnType<typeof formZodSchema>>;

export const formState = reactive<Partial<Schema>>({
    guard_name: "",
    name: "",
    permissions: [],
});
