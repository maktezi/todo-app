<template>
    <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton
            variant="outline"
            class="w-full flex items-center justify-center"
            icon="solar:calendar-search-broken"
            :label="date ? format(date, 'd MMM, yyyy') : 'Select date'"
        />

        <template #panel="{ close }">
            <DatePicker v-model="date" is-required @close="close" />
        </template>
    </UPopover>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import { ref, watch } from "vue";

import DatePicker from "~/components/ui/DatePicker.vue";

const props = defineProps<{
    modelValue: Date | null;
}>();
const emit = defineEmits<{
    (e: "update:modelValue", value: Date | null): void;
}>();

const date = ref<Date | null>(props.modelValue || null);

watch(
    () => props.modelValue,
    (val) => {
        if (val !== date.value) {
            date.value = val ?? new Date();
        }
    },
);

watch(date, (val) => {
    if (val !== props.modelValue) {
        emit("update:modelValue", val);
    }
});
</script>
