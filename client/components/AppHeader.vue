<template>
    <div>
        <header
            class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 px-4 py-3 sticky top-0 z-50"
        >
            <div class="flex items-center justify-between max-w-full">
                <div class="flex items-center">
                    <AppSidebar />
                </div>

                <div class="flex items-center gap-2">
                    <!-- User Profile Dropdown -->
                    <UDropdown
                        :items="userDropdownItems"
                        class="flex items-center hover:bg-slate-100/70 dark:hover:bg-slate-800/70 rounded-lg p-1 transition-colors duration-200"
                    >
                        <div class="flex items-center gap-2 cursor-pointer">
                            <UAvatar
                                :src="'https://cdn.pixabay.com/photo/2024/06/21/10/50/ai-generated-8844136_1280.png'"
                                :alt="auth.user?.name || 'User Avatar'"
                                size="sm"
                                class="ring-2 ring-slate-200 dark:ring-slate-700 hover:ring-primary/50 transition-all duration-200"
                            />

                            <div
                                class="hidden sm:flex flex-col items-start min-w-0"
                            >
                                <span
                                    class="text-sm text-slate-900 dark:text-slate-100 font-medium truncate max-w-24"
                                    :title="auth.user?.name || 'No Name'"
                                >
                                    {{ auth.user?.name || "No Name" }}
                                </span>
                                <span
                                    class="text-xs text-slate-600 dark:text-slate-400 truncate max-w-24"
                                    :title="
                                        auth.user?.roles?.[0]?.name || 'User'
                                    "
                                >
                                    {{ auth.user?.roles?.[0]?.name || "User" }}
                                </span>
                            </div>

                            <UIcon
                                name="solar:alt-arrow-down-bold"
                                class="w-4 h-4 text-slate-400 dark:text-slate-500 hidden sm:block transition-transform duration-200 group-hover:rotate-180"
                            />
                        </div>
                    </UDropdown>

                    <!-- Theme Toggle -->
                    <ClientOnly>
                        <UButton
                            :icon="
                                isDark
                                    ? 'solar:moon-broken'
                                    : 'solar:sun-2-bold'
                            "
                            variant="ghost"
                            :color="isDark ? 'primary' : 'yellow'"
                            aria-label="Theme"
                            class="hover:bg-transparent hover:scale-110 transition-all duration-300 p-1"
                            size="xl"
                            @click="isDark = !isDark"
                        />
                        <template #fallback>
                            <div class="w-8 h-8" />
                        </template>
                    </ClientOnly>
                </div>
            </div>
        </header>

        <ModalForm
            v-model:is-open="isOpen"
            title="Update Profile"
            :form-schema="formSchema"
            :zod-schema="zodSchema"
            :state="formState"
            :on-submit="onSubmit"
            :loading="modalLoading"
        />
    </div>
</template>

<script setup lang="ts">
import { useTimeoutFn } from "@vueuse/shared";

import type { UserInput } from "~/types/codegen/graphql";

import { upsertUser } from "~/graphql/User";
import { authSchema } from "~/pages/users/data/user/authSchema";

const auth = useAuthStore();
const isDark = inject("isDark");
const toast = useToast();
const isOpen = ref(false);
const modalLoading = ref(false);

const userDropdownItems = [
    [
        {
            click: () => (isOpen.value = true),
            icon: "solar:user-circle-outline",
            label: "Profile",
        },
    ],
    [
        {
            click: () => {
                auth.logout();
                useTimeoutFn(() => {
                    toast.add({
                        icon: "solar:check-circle-outline",
                        title: "Logged out successfully",
                    });
                }, 500);
            },
            icon: "solar:logout-outline",
            label: "Logout",
        },
    ],
];

const user = auth.user;
const formState = reactive({
    email: user?.email,
    first_name: user?.first_name,
    id: user?.id,
    last_name: user?.last_name,
    middle_name: user?.middle_name,
    password: "",
    phone: user?.phone,
});
const formSchema = computed(() => authSchema());
const zodSchema = computed(() => formZodSchema(formSchema.value));
const onSubmit = async () => {
    if (!formState.id) return;
    modalLoading.value = true;

    try {
        const { mutate } = useMutation(upsertUser);
        const input: UserInput = {
            email: formState.email,
            first_name: formState.first_name,
            id: formState.id,
            last_name: formState.last_name,
            middle_name: formState.middle_name,
            phone: formState.phone,
        };
        if (formState.password.trim() !== "")
            input.password = formState.password;

        await mutate({ input });
        toast.add({
            color: "green",
            icon: "solar:check-circle-broken",
            title: "Profile updated successfully",
        });
    } catch (e) {
        console.error(e);
    } finally {
        isOpen.value = false;
        modalLoading.value = false;
    }
};
</script>
