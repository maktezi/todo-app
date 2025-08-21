import type { ApolloQueryResult, DocumentNode } from "@apollo/client";
import type { ZodSchema } from "zod";

import { useToast } from "#ui/composables/useToast";

import type {
    Column,
    FilterOption,
    TableAction,
} from "~/components/table/types";
import type { WhereConditions } from "~/types/codegen/graphql";

type Action<
    TInput = unknown,
    TFetchResult = unknown,
    TMutationResult = unknown,
> = {
    auth?: string | undefined;
    fetch: () => Promise<ApolloQueryResult<TFetchResult>> | undefined;
    modal?: Ref<boolean>;
    mutation: (args: TInput) => Promise<TMutationResult>;
};

export function useTableData<T extends Record<string, unknown>>(
    config: {
        title: string;
        singular?: string;
        icon: string;
        permission?: string;
        permissions?: {
            view: string;
            create: string;
            edit: string;
            delete: string;
            updateStatus?: string;
        };
        hasStatus?: boolean;
    },
    queries: {
        paginate: DocumentNode;
        upsert: DocumentNode;
        delete: DocumentNode;
        updateStatus?: <TData = unknown>(params: {
            id: unknown;
            status: boolean;
        }) => TData;
    },
    options?: {
        getFormState?: (item?: T) => Record<string, unknown>;
        prepareSubmitData?: (
            data: Record<string, unknown>,
            selectedItem?: T,
        ) => Record<string, unknown>;
        hasRelations?: boolean;
        relationKey?: string;
        columns: Column[];
        filters?: FilterOption[];
        whereConditions?: WhereConditions | {};
        formSchema: any;
        zodSchema?: ZodSchema;
        hideDefaultActions?: boolean;
        isFormFullscreen?: boolean;
        optionLoading?: Ref<boolean, boolean> | boolean;
        defaultViewModal?: boolean;
        customActions?: TableAction[];
    },
) {
    const defaultGetFormState = (item?: T): Record<string, unknown> => {
        if (item) {
            const state: Record<string, unknown> = {};
            Object.keys(item).forEach((key) => {
                if (key === "id" || key === "name" || key === "is_active") {
                    state[key] =
                        item[key] || (key === "is_active" ? false : "");
                }
            });
            if (item.key === "password") state.password = "";
            return state;
        } else {
            return {
                id: "",
                is_active: false,
                name: "",
            };
        }
    };

    const defaultPrepareSubmitData = (
        data: Record<string, unknown>,
        selectedItem?: T,
    ): Record<string, unknown> => {
        return {
            ...data,
            id: selectedItem?.id || undefined,
        };
    };

    // GraphQL Mutation helper
    async function graphQLMutation<
        TInput = unknown,
        TFetchResult = unknown,
        TMutationResult = unknown,
    >(
        text: string,
        actionText: string,
        loading: Ref<boolean>,
        input: TInput,
        action: Action<TInput, TFetchResult, TMutationResult>,
    ) {
        const toast = useToast();
        try {
            loading.value = true;

            if (action.auth !== input) {
                await action.mutation?.(input);
                toast.add({
                    color: "green",
                    icon: "solar:check-circle-broken",
                    title: `${text} has been ${actionText}.`,
                });
            } else {
                toast.add({
                    color: "red",
                    icon: "i-mdi-alert-circle-outline",
                    title: "Something went wrong please try again.",
                });
            }

            await action.fetch?.();
        } catch (e) {
            const err = parseGraphQLError(e);
            console.error("Remove error:", e);
            toast.add({
                color: "red",
                icon: "i-mdi-alert-circle-outline",
                title: `Error: ${err}`,
            });
        } finally {
            loading.value = false;
            if (action.modal) action.modal.value = false;
        }
    }

    return {
        // Config
        hasStatus: config.hasStatus,
        icon: config.icon,
        permissions: computed(() => {
            if (config.permissions) return config.permissions;
            const base = config.permission;
            return {
                create: `create ${base}`,
                delete: `delete ${base}`,
                edit: `edit ${base}`,
                view: `view ${base}`,
            };
        }).value,

        singular: computed(() => {
            if (config.singular) return config.singular;
            if (!config.permission) return "";
            return (
                config.permission.charAt(0).toUpperCase() +
                config.permission.slice(1)
            );
        }).value,
        title: config.title,

        // Operations
        delete: queries.delete,
        query: queries.paginate,
        updateStatus: queries.updateStatus,
        upsert: queries.upsert,

        // Helpers
        getFormState: options?.getFormState || defaultGetFormState,
        graphQLMutation,
        prepareSubmitData:
            options?.prepareSubmitData || defaultPrepareSubmitData,

        // UI Components
        columns: options?.columns || [],
        filters: options?.filters || [],
        formSchema: options?.formSchema,

        whereConditions: options?.whereConditions || [],
        zodSchema: options?.zodSchema,

        // Optional relations
        customActions: options?.customActions,
        defaultViewModal: options?.defaultViewModal,
        hasRelations: options?.hasRelations,
        hideDefaultActions: options?.hideDefaultActions,
        isFormFullscreen: options?.isFormFullscreen,
        optionLoading: options?.optionLoading,
        relationKey: options?.relationKey,
    };
}
