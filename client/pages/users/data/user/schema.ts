import { z } from "zod";

import type { SearchableFieldHandlers } from "~/components/table/types";
import type { FormSchema } from "~/types/fields";

import { type formZodSchema, phoneRegex } from "~/utils/helpers";

export const schema = (handlers: SearchableFieldHandlers): FormSchema => ({
    fields: [
        {
            class: "col-span-full",
            label: "Role",
            name: "roles",
            onSearch: handlers.role?.onSearch,
            options: handlers.role?.options.value ?? [],
            placeholder: "Select a Role",
            searchable: true,
            type: "combobox",
            validation: z.union([
                z.string().min(1, "Role is required"),
                z.array(z.string()).min(1, "At least one role is required"),
            ]),
        },
        {
            class: "col-span-full md:col-span-6",
            label: "First Name",
            name: "first_name",
            type: "text",
            validation: z.string().min(1, "First name is required"),
        },
        {
            class: "col-span-full md:col-span-6",
            label: "Middle Name",
            name: "middle_name",
            type: "text",
            validation: z.string().optional(),
        },
        {
            class: "col-span-full md:col-span-6",
            label: "Last Name",
            name: "last_name",
            type: "text",
            validation: z.string().min(1, "Last name is required"),
        },
        {
            class: "col-span-full md:col-span-6",
            label: "Phone",
            name: "phone",
            type: "tel",
            validation: z
                .string()
                .optional()
                .refine(
                    (val) => !val || phoneRegex.test(val),
                    "Invalid Philippine phone number",
                ),
        },
        {
            class: "col-span-full",
            label: "Email",
            name: "email",
            type: "email",
            validation: z.string().email("Invalid email"),
        },
        {
            class: "col-span-full",
            label: "Password",
            name: "password",
            type: "password",
            validation: z
                .string()
                .optional()
                .refine(
                    (val) => !val || val.length >= 6,
                    "Password must be at least 6 characters",
                ),
        },
    ],
});

export type Schema = z.infer<ReturnType<typeof formZodSchema>>;

export const formState = reactive<Partial<Schema>>({
    email: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    password: "",
    phone: "",
    roles: [],
});
