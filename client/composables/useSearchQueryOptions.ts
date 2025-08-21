import { useDebounceFn } from "@vueuse/shared";

import type { FieldOption } from "~/types/fields";

interface SearchQueryOptions<T = any> {
    dataKey?: string;
    debounceMs?: number;
    mapFn?: (item: T) => FieldOption;
    pageSize?: number;
    queryKey: string;
    variables?: Record<string, any>;
}

export function useSearchQueryOptions<T = any>(
    query: any,
    options: SearchQueryOptions<T>,
) {
    const {
        dataKey = "data",
        debounceMs = 700,
        mapFn = (item: any) => ({
            label: item.name,
            value: item.id,
        }),
        pageSize = 50,
        queryKey,
        variables = {},
    } = options;

    const searchTerm = ref("");
    const isInitialized = ref(false);

    const queryVariables = computed(() => ({
        first: pageSize,
        search: searchTerm.value,
        ...variables,
    }));

    const { error, loading, refetch, result } = useQuery(query, queryVariables);

    const queryOptions = computed<FieldOption[]>(() => {
        const raw = result.value?.[queryKey];
        if (!raw) return [];
        const items = Array.isArray(raw[dataKey]) ? raw[dataKey] : raw;

        try {
            return items.map(mapFn);
        } catch (err) {
            console.error(`Error mapping ${queryKey} items:`, err);
            return [];
        }
    });

    const searchItems = async (search: string) => {
        searchTerm.value = search;
        await refetch();
        return queryOptions.value;
    };

    const debouncedSearch = useDebounceFn(searchItems, debounceMs);

    const initializeOptions = async () => {
        if (!isInitialized.value) {
            isInitialized.value = true;
            searchTerm.value = "";
            await refetch();
        }
        return queryOptions.value;
    };

    watchEffect(() => {
        if (error.value) {
            console.error(`GraphQL error in "${queryKey}":`, error.value);
        }
    });

    return {
        debouncedSearch,
        initializeOptions,
        loadingOptions: loading,
        queryOptions,
    };
}
