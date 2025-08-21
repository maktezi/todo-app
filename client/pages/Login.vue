<template>
    <div
        class="flex items-center justify-center min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 relative overflow-hidden"
    >
        <!-- Background gradient circles (green theme) -->
        <div
            class="absolute -top-40 -left-40 w-96 h-96 bg-green-500 rounded-lg opacity-5 dark:opacity-10 blur-3xl"
        />
        <div
            class="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500 rounded-lg opacity-5 dark:opacity-10 blur-3xl"
        />

        <UCard
            class="w-full max-w-md relative z-10 backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 shadow-xl border-0 ring-1 ring-slate-200/50 dark:ring-slate-700/50"
        >
            <template #header>
                <div class="text-center">
                    <h1
                        class="text-2xl font-bold text-slate-800 dark:text-slate-200"
                    >
                        Welcome to
                        <span class="text-primary">{{ appTitle }}</span>
                    </h1>
                    <p class="text-slate-800 dark:text-slate-200 mt-2">
                        Sign in to your account
                    </p>
                </div>
            </template>

            <UForm :validate="validate" :state="formState" @submit="onSubmit">
                <UFormGroup label="Email" name="email">
                    <UInput
                        v-model="formState.email"
                        placeholder="Enter your email"
                        type="email"
                        autocomplete="email"
                        icon="i-heroicons-envelope"
                        required
                    />
                </UFormGroup>

                <UFormGroup label="Password" name="password" class="mt-2">
                    <UInput
                        v-model="formState.password"
                        placeholder="Enter your password"
                        type="password"
                        autocomplete="current-password"
                        icon="i-heroicons-lock-closed"
                        required
                    />
                </UFormGroup>

                <div class="flex items-center justify-between mt-1">
                    <UCheckbox
                        v-model="formState.rememberMe"
                        label="Remember me"
                        name="remember"
                    />
                    <UButton
                        to="/forgot-password"
                        variant="link"
                        color="primary"
                    >
                        Forgot password?
                    </UButton>
                </div>

                <UButton
                    type="submit"
                    block
                    color="primary"
                    class="mt-3 py-2"
                    :loading="isLoading"
                    :disabled="!formState.email || !formState.password"
                >
                    Log in
                </UButton>
            </UForm>

            <template #footer>
                <div class="text-center">
                    <p class="text-gray-600 text-sm">
                        Don't have an account?
                        <UButton to="/register" variant="link" color="primary">
                            Create an account
                        </UButton>
                    </p>

                    <UDivider label="Or continue with" class="my-4" />

                    <div class="flex justify-center space-x-4 mt-4">
                        <UButton
                            color="gray"
                            variant="ghost"
                            icon="i-mdi-google"
                            aria-label="Continue with Google"
                        />
                        <UButton
                            color="gray"
                            variant="ghost"
                            icon="i-mdi-facebook"
                            aria-label="Continue with Facebook"
                        />
                        <UButton
                            color="gray"
                            variant="ghost"
                            icon="i-mdi-apple"
                            aria-label="Continue with Apple"
                        />
                    </div>
                </div>
            </template>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
import { useTimeoutFn } from "@vueuse/shared";
import { ref, reactive } from "vue";
import { z } from "zod";

import type { FormState } from "~/types/global";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    rememberMe: z.boolean().optional(),
});

const formState = reactive<FormState>({
    email: "admin@mail.com",
    password: "admin1234",
    rememberMe: false,
});

const validate = (state: FormState) => {
    const result = loginSchema.safeParse(state);
    if (result.success) return [];

    return result.error.issues.map((issue) => ({
        message: issue.message,
        path: issue.path.join("."),
    }));
};

const isLoading = ref<boolean>(false);
const authStore = useAuthStore();
const toast = useToast();

const onSubmit = async () => {
    const validationErrors = validate(formState);

    if (validationErrors.length > 0) return;
    isLoading.value = true;

    try {
        await authStore.login(formState);
    } catch (e) {
        toast.add({
            color: "red",
            description: e.message,
            icon: "i-mdi-alert-circle-outline",
            title: "Authentication failed",
        });
    } finally {
        useTimeoutFn(() => {
            isLoading.value = false;
        }, 1000);
    }
};

const { appDescription, appTitle, metaDescription } = useConstants();
useHead({
    meta: [
        {
            content: metaDescription,
            name: "description",
        },
    ],
    title: `${appTitle} - ${appDescription}`,
});
</script>
