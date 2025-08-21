import type { ButtonColor } from "#ui/types";

import type { FieldOption } from "~/types/fields";

export interface Column {
    class?: string;
    key: string;
    label?: string;
    render?: (row: any) => any;
    sortable?: boolean;
}

export interface FilterOption {
    key: string | number;
    label: string;
    value: boolean | string;
}

export interface Sort {
    column: string;
    direction: "asc" | "desc";
}

export type Row = Record<string, any>;

export interface TableAction {
    color: (row: any) => ButtonColor;
    condition: (row: any) => boolean | undefined;
    icon: (row: any) => string;
    onClick: (row: any) => void;
    tooltip: (row: any) => string;
}

export interface CrudConfig {
    hasStatus?: boolean;
    icon: string;
    permissions: {
        create: string;
        view: string;
        edit: string;
        delete: string;
        updateStatus?: string;
    };
    singular: string;
    title: string;
}

export interface CrudOperations<T> {
    delete: any;
    getFormState: (item?: T) => any;
    prepareSubmitData: (data: any, selectedItem?: T) => any;
    query: any;
    updateStatus?: any;
    upsert: any;
}

export interface TableOperations<T> {
    delete: <TData = unknown>(id: unknown) => TData;
    getFormState?: (item?: T) => Record<string, unknown>;
    prepareSubmitData?: (
        data: Record<string, unknown>,
        selectedItem?: T,
    ) => Record<string, unknown>;
    query: <TData = unknown>(id: unknown) => TData;
    updateStatus: <TData = unknown>(params: {
        id: unknown;
        status: boolean;
    }) => TData;
    upsert: <TData = unknown>(data: unknown) => TData;
}

export type SearchableFieldHandlers = {
    [key: string]: {
        options: Ref<FieldOption[]>;
        onSearch: (q: string) => Promise<FieldOption[]>;
    };
};
