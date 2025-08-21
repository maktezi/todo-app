<template>
    <UModal v-model="isModalOpen" :fullscreen="isFullscreen">
        <UCard
            :ui="{
                ring: '',
                divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            }"
        >
            <template #header>
                <div class="flex items-center">
                    <UIcon
                        name="i-heroicons-pencil-square"
                        class="mr-3 text-emerald-500 text-xl"
                    />
                    <span
                        class="text-lg text-gray-900 dark:text-gray-100 font-medium"
                    >
                        {{ title }}
                    </span>
                </div>
            </template>

            <UForm
                :schema="zodSchema"
                :state="state"
                class="space-y-4 gap-x-2 grid-cols-12 grid"
                @submit="onSubmit"
            >
                <template v-for="field in formSchema.fields" :key="field.name">
                    <UFormGroup
                        :label="field.label"
                        :name="field.name"
                        :class="field.class || 'col-span-full'"
                    >
                        <component
                            :is="resolveComponent(field.type)"
                            v-model="state[field.name]"
                            :disabled="field.disabled"
                            :hidden="field.hidden"
                            :type="field.type"
                            :options="field.options"
                            :multiple="field.multiple || false"
                            :placeholder="
                                field.placeholder || `Enter ${field.label}`
                            "
                            :searchable="
                                field.searchable === true
                                    ? (query: string) => field.onSearch?.(query)
                                    : false
                            "
                            :value-attribute="
                                field.valueAttribute ||
                                (['select', 'combobox'].includes(field.type)
                                    ? 'value'
                                    : undefined)
                            "
                            :option-attribute="
                                field.optionAttribute ||
                                (['select', 'combobox'].includes(field.type)
                                    ? 'label'
                                    : undefined)
                            "
                            :loading="
                                ['select', 'combobox'].includes(field.type)
                                    ? optionLoading
                                    : undefined
                            "
                        >
                            <template
                                v-if="
                                    ['select', 'combobox'].includes(field.type)
                                "
                                #leading="{ optionsLoading }"
                            >
                                <UIcon
                                    v-if="optionsLoading"
                                    name="i-heroicons-arrow-path"
                                    class="animate-spin text-primary"
                                />
                                <UIcon
                                    v-else
                                    name="mdi:form-dropdown"
                                    class="text-primary"
                                />
                            </template>
                        </component>
                    </UFormGroup>
                </template>

                <div class="flex col-span-full justify-end gap-2 pt-4">
                    <UButton
                        color="gray"
                        variant="ghost"
                        @click="isModalOpen = false"
                    >
                        Cancel
                    </UButton>
                    <UButton :loading="loading" type="submit" label="Submit" />
                </div>
            </UForm>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import type { ZodSchema } from "zod";

import { UInput, USelectMenu, UTextarea } from "#components";

import type { FieldType, FormSchema } from "~/types/fields";

import DatePicker from "~/components/DatePickerButton.vue";

const emit = defineEmits<{
    (e: "update:is-open", value: boolean): void;
}>();

type Props<T> = {
    isOpen: boolean;
    title?: string;
    formSchema: FormSchema;
    zodSchema?: ZodSchema;
    state: T;
    loading: boolean;
    optionLoading?: Ref<boolean, boolean> | boolean;
    onSubmit: (event: FormSubmitEvent<T>) => void;
    isFullscreen?: boolean;
};

const props = defineProps<Props<unknown>>();

const isModalOpen = computed({
    get: () => props.isOpen,
    set: (value: boolean) => emit("update:is-open", value),
});

const componentMap: Record<FieldType, Component> = {
    combobox: USelectMenu,
    date: DatePicker,
    email: UInput,
    number: UInput,
    password: UInput,
    select: USelectMenu,
    tel: UInput,
    text: UInput,
    textarea: UTextarea,
};

function resolveComponent(type: FieldType): Component {
    return componentMap[type] || UInput;
}
</script>
