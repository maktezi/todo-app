import { z } from "zod";

import type { FormSchema } from "~/types/fields";
import type { formZodSchema } from "~/utils/helpers";

export const schema = (): FormSchema => ({
    fields: [
        {
            class: "col-span-full",
            label: "Document Type",
            name: "type",
            options: [
                // ✅ City-level certificates
                {
                    category: "city_certificate",
                    label: "Mayor’s Clearance",
                    value: "mayors_clearance",
                },
                {
                    category: "city_certificate",
                    label: "Certificate of Business Registration",
                    value: "certificate_business_registration",
                },
                {
                    category: "city_certificate",
                    label: "Certificate of No Pending Case",
                    value: "certificate_no_pending_case",
                },
                {
                    category: "city_certificate",
                    label: "Certificate of Tax Payment",
                    value: "certificate_tax_payment",
                },
            ],
            type: "select",
            validation: z.string().min(1, "Document type is required"),
        },
        {
            class: "col-span-6",
            label: "Requested at",
            name: "requested_at",
            type: "date",
            validation: z.preprocess((val) => {
                if (typeof val === "string" || val instanceof Date) {
                    const date = new Date(val);
                    return isNaN(date.getTime()) ? undefined : date;
                }
                return undefined;
            }, z.date()),
        },
        // {
        //     class: "col-span-6",
        //     label: "Issued at",
        //     name: "issued_at",
        //     type: "date",
        //     validation: z.preprocess((val) => {
        //         if (typeof val === "string" || val instanceof Date) {
        //             const date = new Date(val);
        //             return isNaN(date.getTime()) ? undefined : date;
        //         }
        //         return undefined;
        //     }, z.date()),
        // },
        {
            class: "col-span-6",
            label: "Valid until",
            name: "valid_until",
            type: "date",
            validation: z.preprocess((val) => {
                if (typeof val === "string" || val instanceof Date) {
                    const date = new Date(val);
                    return isNaN(date.getTime()) ? undefined : date;
                }
                return undefined;
            }, z.date().optional()),
        },
    ],
});

export type Schema = z.infer<ReturnType<typeof formZodSchema>>;
