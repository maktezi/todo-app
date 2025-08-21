import { z } from "zod";

import type { FormSchema } from "~/types/fields";
import type { formZodSchema } from "~/utils/helpers";

export const schema = (): FormSchema => ({
    fields: [
        {
            class: "col-span-full",
            label: "Name",
            name: "name",
            type: "text",
            validation: z.string().min(1, "Name is required"),
        },
    ],
});

export type Schema = z.infer<ReturnType<typeof formZodSchema>>;

export const formState = reactive<Partial<Schema>>({
    guard_name: "",
    name: "",
});
