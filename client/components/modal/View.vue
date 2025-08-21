<template>
    <UModal v-model="isModalOpen" :ui="{ width: 'max-w-4xl' }">
        <UCard class="overflow-hidden">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="flex items-center justify-center gap-3">
                            <UIcon
                                name="i-heroicons-eye"
                                class="text-primary text-xl"
                            />
                            <h3
                                class="text-xl font-bold text-gray-900 dark:text-gray-100"
                            >
                                {{ title }}
                            </h3>
                        </div>
                    </div>
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark"
                        size="sm"
                        square
                        @click="isModalOpen = false"
                    />
                </div>
            </template>

            <!-- Enhanced content with better spacing and organization -->
            <div class="max-h-[70vh] overflow-y-auto">
                <div class="grid gap-4">
                    <!-- Group fields by category for better organization -->
                    <template
                        v-for="(group, groupName) in groupedFields"
                        :key="groupName"
                    >
                        <div v-if="group.length > 0" class="space-y-2">
                            <div
                                class="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
                            >
                                <UIcon
                                    :name="getGroupIcon(groupName)"
                                    class="text-gray-500 text-xs"
                                />
                                <h4
                                    class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide"
                                >
                                    {{ groupName }}
                                </h4>
                            </div>

                            <!-- Regular fields in grid -->
                            <div class="grid gap-2 md:grid-cols-2">
                                <template
                                    v-for="field in group.filter(
                                        (f) => !isLongTextField(f),
                                    )"
                                    :key="field.name"
                                >
                                    <div
                                        class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <div class="space-y-1">
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <UIcon
                                                    :name="getFieldIcon(field)"
                                                    class="text-gray-400 text-xs flex-shrink-0"
                                                />
                                                <label
                                                    class="text-xs font-medium text-gray-600 dark:text-gray-400"
                                                >
                                                    {{ field.label }}
                                                </label>
                                            </div>

                                            <div
                                                class="min-h-[1.5rem] flex items-start"
                                            >
                                                <!-- Boolean/Status fields -->
                                                <template
                                                    v-if="
                                                        field.name.includes(
                                                            'is_',
                                                        ) ||
                                                        field.name.includes(
                                                            'has_',
                                                        ) ||
                                                        typeof state[
                                                            field.name
                                                        ] === 'boolean'
                                                    "
                                                >
                                                    <UBadge
                                                        :color="
                                                            state[field.name]
                                                                ? 'green'
                                                                : 'red'
                                                        "
                                                        :label="
                                                            state[field.name]
                                                                ? 'Active'
                                                                : 'Inactive'
                                                        "
                                                        size="sm"
                                                        class="animate-pulse"
                                                    />
                                                </template>

                                                <!-- Date fields -->
                                                <template
                                                    v-else-if="
                                                        field.name.includes(
                                                            '_at',
                                                        ) ||
                                                        field.name.includes(
                                                            'date',
                                                        ) ||
                                                        field.type === 'date'
                                                    "
                                                >
                                                    <div
                                                        v-if="state[field.name]"
                                                        class="flex items-center gap-2"
                                                    >
                                                        <span
                                                            class="text-gray-900 dark:text-gray-100 font-medium"
                                                        >
                                                            {{
                                                                getDateOnly(
                                                                    state[
                                                                        field
                                                                            .name
                                                                    ],
                                                                )
                                                            }}
                                                        </span>
                                                        <span
                                                            class="text-xs text-gray-500 dark:text-gray-400"
                                                        >
                                                            {{
                                                                getRelativeTime(
                                                                    state[
                                                                        field
                                                                            .name
                                                                    ],
                                                                )
                                                            }}
                                                        </span>
                                                    </div>
                                                    <span
                                                        v-else
                                                        class="text-gray-400 italic text-xs"
                                                        >Not set</span
                                                    >
                                                </template>

                                                <!-- Email fields -->
                                                <template
                                                    v-else-if="
                                                        field.type === 'email'
                                                    "
                                                >
                                                    <a
                                                        v-if="state[field.name]"
                                                        :href="`mailto:${state[field.name]}`"
                                                        class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center gap-1 group"
                                                    >
                                                        <span>{{
                                                            state[field.name]
                                                        }}</span>
                                                        <UIcon
                                                            name="i-heroicons-arrow-top-right-on-square"
                                                            class="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                        />
                                                    </a>
                                                    <span
                                                        v-else
                                                        class="text-gray-400 italic text-xs"
                                                        >Not set</span
                                                    >
                                                </template>

                                                <!-- Phone fields -->
                                                <template
                                                    v-else-if="
                                                        field.type === 'tel'
                                                    "
                                                >
                                                    <a
                                                        v-if="state[field.name]"
                                                        :href="`tel:${state[field.name]}`"
                                                        class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center gap-1 group"
                                                    >
                                                        <span>{{
                                                            state[field.name]
                                                        }}</span>
                                                        <UIcon
                                                            name="i-heroicons-phone"
                                                            class="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                        />
                                                    </a>
                                                    <span
                                                        v-else
                                                        class="text-gray-400 italic text-xs"
                                                        >Not set</span
                                                    >
                                                </template>

                                                <!-- Array fields -->
                                                <template
                                                    v-else-if="
                                                        Array.isArray(
                                                            state[field.name],
                                                        )
                                                    "
                                                >
                                                    <div
                                                        v-if="
                                                            state[field.name]
                                                                ?.length > 0
                                                        "
                                                        class="flex flex-wrap gap-1"
                                                    >
                                                        <UBadge
                                                            v-for="(
                                                                item, index
                                                            ) in state[
                                                                field.name
                                                            ]"
                                                            :key="index"
                                                            :label="
                                                                getArrayItemLabel(
                                                                    item,
                                                                )
                                                            "
                                                            color="blue"
                                                            variant="soft"
                                                            size="xs"
                                                        />
                                                    </div>
                                                    <span
                                                        v-else
                                                        class="text-gray-400 italic text-xs"
                                                        >None</span
                                                    >
                                                </template>

                                                <!-- Select/Combobox fields -->
                                                <template
                                                    v-else-if="
                                                        [
                                                            'select',
                                                            'combobox',
                                                        ].includes(field.type)
                                                    "
                                                >
                                                    <span
                                                        v-if="
                                                            getDisplayValue(
                                                                field,
                                                                state[
                                                                    field.name
                                                                ],
                                                            )
                                                        "
                                                        class="text-gray-900 dark:text-gray-100 font-medium"
                                                    >
                                                        {{
                                                            getDisplayValue(
                                                                field,
                                                                state[
                                                                    field.name
                                                                ],
                                                            )
                                                        }}
                                                    </span>
                                                    <span
                                                        v-else
                                                        class="text-gray-400 italic text-xs"
                                                        >Not selected</span
                                                    >
                                                </template>

                                                <!-- Password fields -->
                                                <template
                                                    v-else-if="
                                                        field.type ===
                                                        'password'
                                                    "
                                                >
                                                    <div
                                                        class="flex items-center gap-2"
                                                    >
                                                        <span
                                                            class="text-gray-400 font-mono"
                                                            >••••••••</span
                                                        >
                                                        <UBadge
                                                            label="Protected"
                                                            color="yellow"
                                                            size="xs"
                                                        />
                                                    </div>
                                                </template>

                                                <!-- Long text fields -->
                                                <template
                                                    v-else-if="
                                                        field.name.includes(
                                                            'description',
                                                        ) ||
                                                        field.name.includes(
                                                            'content',
                                                        ) ||
                                                        field.type ===
                                                            'textarea'
                                                    "
                                                >
                                                    <div
                                                        v-if="state[field.name]"
                                                        class="w-full"
                                                    >
                                                        <div
                                                            class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-3 max-h-32 overflow-y-auto"
                                                        >
                                                            <p
                                                                class="text-gray-700 dark:text-gray-300 text-xs leading-relaxed whitespace-pre-wrap break-words"
                                                            >
                                                                {{
                                                                    state[
                                                                        field
                                                                            .name
                                                                    ]
                                                                }}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span
                                                        v-else
                                                        class="text-gray-400 italic text-xs"
                                                        >Empty</span
                                                    >
                                                </template>

                                                <!-- Default text display -->
                                                <template v-else>
                                                    <span
                                                        v-if="
                                                            hasValue(
                                                                state[
                                                                    field.name
                                                                ],
                                                            )
                                                        "
                                                        class="text-gray-900 dark:text-gray-100 font-medium break-words"
                                                    >
                                                        {{ state[field.name] }}
                                                    </span>
                                                    <span
                                                        v-else
                                                        class="text-gray-400 italic text-xs"
                                                        >Empty</span
                                                    >
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>

                            <!-- Long text fields (description, content, textarea) - full width -->
                            <div class="space-y-4">
                                <template
                                    v-for="field in group.filter((f) =>
                                        isLongTextField(f),
                                    )"
                                    :key="field.name"
                                >
                                    <div
                                        class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <div class="space-y-3">
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <UIcon
                                                    :name="getFieldIcon(field)"
                                                    class="text-gray-400 text-xs flex-shrink-0"
                                                />
                                                <label
                                                    class="text-xs font-medium text-gray-600 dark:text-gray-400"
                                                >
                                                    {{ field.label }}
                                                </label>
                                            </div>

                                            <div class="w-full">
                                                <div
                                                    v-if="state[field.name]"
                                                    class="w-full"
                                                >
                                                    <div
                                                        class="p-2 max-h-40 overflow-y-auto"
                                                    >
                                                        <p
                                                            class="text-gray-700 dark:text-gray-300 text-xs leading-relaxed whitespace-pre-wrap break-words"
                                                        >
                                                            {{
                                                                state[
                                                                    field.name
                                                                ]
                                                            }}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    v-else
                                                    class="text-gray-400 italic text-xs p-2"
                                                >
                                                    Empty
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <div class="flex justify-between items-center mt-4">
                <div
                    class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                >
                    <UIcon
                        name="i-heroicons-information-circle"
                        class="text-xs"
                    />
                    <span
                        >Last updated:
                        {{
                            getRelativeTime(state.updated_at || new Date())
                        }}</span
                    >
                </div>
                <div class="flex gap-3">
                    <UButton
                        color="gray"
                        variant="ghost"
                        @click="isModalOpen = false"
                    >
                        Close
                    </UButton>
                    <UButton
                        v-if="showEditButton"
                        color="blue"
                        @click="$emit('edit-clicked')"
                    >
                        Edit
                    </UButton>
                </div>
            </div>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
import type { FormSchema } from "~/types/fields";

const emit = defineEmits<{
    (e: "update:is-open", value: boolean): void;
    (e: "edit-clicked"): void;
}>();

type Props<T> = {
    isOpen: boolean;
    title?: string;
    formSchema: FormSchema;
    state: any;
    showEditButton?: boolean;
};

const props = withDefaults(defineProps<Props<unknown>>(), {
    showEditButton: true,
    title: "Details View",
});

const isModalOpen = computed({
    get: () => props.isOpen,
    set: (value: boolean) => emit("update:is-open", value),
});

// Group fields by category for better organization
const groupedFields = computed(() => {
    const groups: Record<string, any[]> = {
        "Additional Information": [],
        "Basic Information": [],
        "Contact Details": [],
        "Dates & Time": [],
        "Status & Settings": [],
    };

    props.formSchema.fields.forEach((field) => {
        if (!shouldShowField(field.name)) return;

        if (
            field.type === "email" ||
            field.type === "tel" ||
            field.name.includes("phone") ||
            field.name.includes("email")
        ) {
            groups["Contact Details"].push(field);
        } else if (
            field.name.includes("is_") ||
            field.name.includes("has_") ||
            typeof props.state[field.name] === "boolean"
        ) {
            groups["Status & Settings"].push(field);
        } else if (
            field.name.includes("_at") ||
            field.name.includes("date") ||
            field.type === "date"
        ) {
            groups["Dates & Time"].push(field);
        } else if (
            field.name.includes("description") ||
            field.name.includes("content") ||
            field.type === "textarea"
        ) {
            groups["Basic Information"].push(field);
        } else {
            groups["Basic Information"].push(field);
        }
    });

    // Remove empty groups
    Object.keys(groups).forEach((key) => {
        if (groups[key].length === 0) {
            delete groups[key];
        }
    });

    return groups;
});

// Helper function to check if field is a long text field
function isLongTextField(field: any): boolean {
    return (
        field.name.includes("description") ||
        field.name.includes("content") ||
        field.type === "textarea"
    );
}

// Helper function to check if field should be shown (exclude internal fields)
function shouldShowField(fieldName: string): boolean {
    const excludeFields = ["id", "created_at", "updated_at"];
    return !excludeFields.includes(fieldName);
}

// Helper function to check if value exists
function hasValue(value: any): boolean {
    return value !== null && value !== undefined && value !== "";
}

// Helper function to get display value for select/combobox fields
function getDisplayValue(field: any, value: any): string {
    if (!value) return "";

    if (field.options && Array.isArray(field.options)) {
        const option = field.options.find((opt: any) => {
            const optValue = field.valueAttribute
                ? opt[field.valueAttribute]
                : opt.value;
            return optValue === value;
        });

        if (option) {
            return field.optionAttribute
                ? option[field.optionAttribute]
                : option.label;
        }
    }

    if (typeof value === "object") {
        return value.label || value.name || value.title || value.toString();
    }

    return value.toString();
}

// Helper function to get array item labels
function getArrayItemLabel(item: any): string {
    if (typeof item === "object" && item !== null) {
        return item.label || item.name || item.value || item.toString();
    }
    return item.toString();
}

// Helper function to get relative time
function getRelativeTime(date: string | Date): string {
    if (!date) return "";

    const now = new Date();
    const targetDate = new Date(date);
    const diffMs = now.getTime() - targetDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;

    return targetDate.toLocaleDateString();
}

// Helper function to get group icons
function getGroupIcon(groupName: string): string {
    const icons: Record<string, string> = {
        "Additional Information": "i-heroicons-document-text",
        "Basic Information": "i-heroicons-identification",
        "Contact Details": "i-heroicons-at-symbol",
        "Dates & Time": "i-heroicons-calendar-days",
        "Status & Settings": "i-heroicons-cog-6-tooth",
    };
    return icons[groupName] || "i-heroicons-folder";
}

// Helper function to get field icons
function getFieldIcon(field: any): string {
    if (
        field.name.includes("is_") ||
        field.name.includes("has_") ||
        typeof props.state[field.name] === "boolean"
    ) {
        return "i-heroicons-check-circle";
    }
    if (field.type === "email") return "i-heroicons-envelope";
    if (field.type === "tel") return "i-heroicons-phone";
    if (
        field.name.includes("_at") ||
        field.name.includes("date") ||
        field.type === "date"
    ) {
        return "i-heroicons-calendar";
    }
    if (
        field.name.includes("description") ||
        field.name.includes("content") ||
        field.type === "textarea"
    ) {
        return "i-heroicons-document-text";
    }
    if (field.type === "password") return "i-heroicons-lock-closed";
    if (Array.isArray(props.state[field.name])) return "i-heroicons-tag";

    return "i-heroicons-document";
}
</script>
