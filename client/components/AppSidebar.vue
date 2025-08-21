<template>
    <div>
        <UButton
            icon="solar:hamburger-menu-broken"
            variant="ghost"
            color="green"
            size="xl"
            class="w-full justify-start hover:bg-transparent hover:scale-110 transition-all duration-300 p-2"
            @click="isOpen = true"
        >
            <USlideover
                v-model="isOpen"
                :overlay="true"
                side="left"
                :ui="{
                    width: 'w-64 max-w-xs',
                    border: 'border-r border-gray-200 dark:border-gray-800',
                    shadow: 'shadow-xl',
                }"
            >
                <div class="flex flex-col h-full">
                    <div
                        class="px-4 py-5 border-b border-gray-200 dark:border-gray-800"
                    >
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <UIcon
                                    name="mdi:connect-without-contact"
                                    class="h-6 w-6 text-green-600"
                                />
                                <h2
                                    class="ml-2 text-xl font-bold text-gray-800 dark:text-gray-100"
                                >
                                    FullstackApp
                                </h2>
                            </div>
                            <UButton
                                icon="i-heroicons-x-mark"
                                variant="ghost"
                                color="gray"
                                size="sm"
                                class="rounded-full"
                                aria-label="Close sidebar"
                                @click="isOpen = false"
                            />
                        </div>
                    </div>

                    <div class="flex-1 overflow-y-auto p-4">
                        <nav>
                            <ul class="space-y-1">
                                <li
                                    v-for="(item, index) in mainMenuItems"
                                    :key="index"
                                >
                                    <UButton
                                        v-if="item.permission"
                                        :icon="item.icon"
                                        :to="item.to"
                                        :color="
                                            isActive(item.to) ? 'green' : 'gray'
                                        "
                                        :variant="
                                            isActive(item.to) ? 'soft' : 'ghost'
                                        "
                                        :class="
                                            isActive(item.to) ? 'scale-105' : ''
                                        "
                                        class="w-full justify-start py-2 px-3 hover:scale-105 transition-all duration-300"
                                        square
                                        padded
                                        @click="isOpen = false"
                                    >
                                        {{ item.label }}
                                    </UButton>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </USlideover>
        </UButton>
    </div>
</template>

<script setup lang="ts">
const isOpen = ref(false);
const route = useRoute();
const { mainMenuItems } = useLinks();

const isActive = (path: string) => {
    return route.path === path;
};
</script>
