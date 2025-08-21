import { z } from "zod";

import type { FormSchema } from "~/types/fields";

import { type formZodSchema, phoneRegex } from "~/utils/helpers";

export const authSchema = (): FormSchema => ({
    fields: [
        {
            class: "col-span-full",
            label: "First Name",
            name: "first_name",
            type: "text",
            validation: z.string().min(1, "First name is required"),
        },
        {
            class: "col-span-full",
            label: "Middle Name",
            name: "middle_name",
            type: "text",
        },
        {
            class: "col-span-full",
            label: "Last Name",
            name: "last_name",
            type: "text",
            validation: z.string().min(1, "Last name is required"),
        },
        {
            class: "col-span-full",
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
