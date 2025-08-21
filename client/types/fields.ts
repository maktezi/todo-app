import type { ZodTypeAny } from "zod";

export type FieldType =
    | "text"
    | "email"
    | "password"
    | "select"
    | "combobox"
    | "tel"
    | "number"
    | "date"
    | "textarea";

export interface FieldOption {
    [key: string]: any;
    label: string;
    value: string | number;
}

export interface FormField {
    class?: string;
    disabled?: boolean | (() => boolean) | undefined;
    hidden?: boolean | (() => boolean) | undefined;
    label: string;
    multiple?: boolean;
    name: string;
    onSearch?: (query: string) => Promise<FieldOption[]>;
    optionAttribute?: string;
    options?: FieldOption[];
    placeholder?: string;
    required?: boolean;
    searchable?: boolean;
    type: FieldType;
    validation?: ZodTypeAny;
    valueAttribute?: string;
}

export interface FormSchema {
    fields: FormField[];
}
