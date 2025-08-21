<template>
    <UModal v-model="isConfirmOpen">
        <div class="p-6 space-y-4">
            <div class="flex items-center">
                <UIcon
                    v-if="props.icon"
                    :name="props.icon"
                    class="mr-3 text-red-500 text-xl"
                />
                <span
                    class="text-lg text-gray-600 dark:text-gray-100 font-medium"
                    >Confirm {{ props.label }}
                </span>
            </div>

            <p class="text-gray-500 dark:text-gray-200">
                {{ props.description }}
            </p>

            <div class="flex justify-end space-x-3 pt-3">
                <UButton
                    color="gray"
                    variant="outline"
                    @click="isConfirmOpen = false"
                >
                    Cancel
                </UButton>
                <UButton
                    :color="color"
                    variant="solid"
                    :loading="loading"
                    @click="handleAction"
                >
                    {{ props.label }}
                </UButton>
            </div>
        </div>
    </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
    isOpen: boolean;
    loading: boolean;
    action?: () => Promise<void> | void;
    label?: string;
    description?: string;
    icon?: string;
    color?: string;
}>();

const emit = defineEmits<{
    (e: "update:is-open", isOpen: boolean): void;
}>();

const isConfirmOpen = computed({
    get() {
        return props.isOpen;
    },
    set(value) {
        emit("update:is-open", value);
    },
});

async function handleAction() {
    if (props.action) await props.action();
    isConfirmOpen.value = false;
}
</script>
