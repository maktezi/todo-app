<template>
    <UModal
        :model-value="isOpen"
        :prevent-close="loading"
        @update:model-value="emitClose"
    >
        <div class="p-6 space-y-6">
            <!-- Header -->
            <div class="text-center space-y-2">
                <div
                    class="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center"
                >
                    <Icon :name="icon" class="w-8 h-8 text-primary" />
                </div>
                <h3 class="text-xl font-bold text-primary">{{ title }}</h3>
                <p class="text-sm text-gray-500">{{ description }}</p>
            </div>

            <!-- OTP Inputs -->
            <div class="space-y-4">
                <div class="flex justify-center gap-3">
                    <input
                        v-for="(digit, index) in otpDigits"
                        :key="index"
                        :ref="(el) => setInputRef(el, index)"
                        v-model="otpDigits[index]"
                        type="text"
                        inputmode="numeric"
                        maxlength="1"
                        class="w-12 h-12 text-center bg-primary/10 text-lg font-bold text-primary border rounded-lg transition-colors"
                        :class="{
                            'border-red-500 focus:ring-red-500': hasError,
                            'border-green-500 bg-green-50 dark:bg-green-900':
                                digit && !hasError,
                            'bg-gray-500': loading,
                        }"
                        :disabled="loading"
                        @input="handleInput(index, $event)"
                        @keydown="handleKeydown(index, $event)"
                        @paste="handlePaste"
                    />
                </div>

                <div v-if="hasError" class="text-center text-sm text-red-600">
                    {{ errorMessage }}
                </div>

                <div v-if="showTimer" class="text-center text-sm text-gray-500">
                    Code expires in
                    <span class="font-mono font-bold text-green-600">{{
                        formatTime(timeLeft)
                    }}</span>
                </div>
            </div>

            <!-- Buttons -->
            <div class="flex flex-col gap-3">
                <UButton
                    size="lg"
                    class="justify-center"
                    :disabled="!isOtpComplete || loading"
                    :loading="loading"
                    @click="verifyOtpMethod"
                >
                    {{ loading ? "Loading..." : "Verify Code" }}
                </UButton>

                <div class="flex justify-between items-center">
                    <UButton
                        variant="ghost"
                        color="gray"
                        :disabled="loading"
                        @click="emitClose(false)"
                    >
                        Cancel
                    </UButton>
                    <UButton
                        variant="ghost"
                        size="sm"
                        color="gray"
                        :disabled="!canResend || loading"
                        @click="sendOtp"
                    >
                        {{
                            canResend
                                ? "Resend Code"
                                : `Resend in ${resendTimer}s`
                        }}
                    </UButton>
                </div>
            </div>
        </div>
    </UModal>
</template>

<script setup lang="ts">
import { useTimeoutFn } from "@vueuse/shared";

import { requestOtp, verifyOtp } from "~/graphql/Auth";
import { formatTime, hmacSHA256 } from "~/utils/helpers";

const props = defineProps<{
    isOpen: boolean;
    userId?: string | number; // existing user flow
    email?: string; // registration flow
    sessionPrefix?: string;
    title?: string;
    description?: string;
    icon?: string;
    expiryTime?: number; // default 300s
    resendDelay?: number; // default 60s
    onVerified?: () => void;
}>();

const emit = defineEmits<{
    (e: "update:isOpen", value: boolean): void;
}>();

const toast = useToast();

const otpDigits = ref<string[]>(Array(6).fill(""));
const inputRefs = ref<HTMLInputElement[]>([]);
const hasError = ref(false);
const errorMessage = ref("");
const timeLeft = ref(props.expiryTime ?? 300);
const resendTimer = ref(props.resendDelay ?? 60);
const canResend = ref(false);
const loading = ref(false);

const sessionKey = computed(() => {
    const identifier = props.userId || props.email;
    return `${props.sessionPrefix || "otp"}:${identifier}`;
});

const otpValue = computed(() => otpDigits.value.join(""));
const isOtpComplete = computed(() => otpDigits.value.every((d) => d !== ""));
const showTimer = computed(() => timeLeft.value > 0);

// OTP Input Handling
function setInputRef(el: HTMLInputElement | null, index: number) {
    if (el) inputRefs.value[index] = el;
}
function handleInput(index: number, event: Event) {
    const value = (event.target as HTMLInputElement).value.replace(/\D/g, "");
    otpDigits.value[index] = value;
    if (value && index < 5) inputRefs.value[index + 1]?.focus();
    if (hasError.value) clearError();
    if (isOtpComplete.value) useTimeoutFn(() => verifyOtpMethod(), 150);
}
function handleKeydown(index: number, event: KeyboardEvent) {
    if (event.key === "Backspace" && !otpDigits.value[index] && index > 0)
        inputRefs.value[index - 1]?.focus();
    if (event.key === "ArrowLeft" && index > 0)
        inputRefs.value[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < 5)
        inputRefs.value[index + 1]?.focus();
}
function handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const digits = event.clipboardData
        ?.getData("text")
        ?.replace(/\D/g, "")
        .slice(0, 6);
    if (!digits) return;
    digits.split("").forEach((d, i) => (otpDigits.value[i] = d));
    const next = digits.length < 6 ? digits.length : 5;
    inputRefs.value[next]?.focus();
}

// OTP Logic
async function sendOtp() {
    try {
        loading.value = true;
        const { mutate } = useMutation(requestOtp);
        const { data } = await mutate({
            email: props.email || undefined,
            sessionKey: sessionKey.value,
            userId: props.userId || undefined,
        });
        if (!data?.requestOtp?.status)
            throw new Error(data?.requestOtp?.error || "OTP request failed");

        toast.add({ color: "green", title: "OTP sent to your email" });
        resetTimers();
    } catch (e: any) {
        showError(e?.message || "Failed to send OTP");
    } finally {
        loading.value = false;
    }
}

async function verifyOtpMethod() {
    if (!isOtpComplete.value) return showError("Please enter all 6 digits");

    try {
        loading.value = true;
        const { mutate } = useMutation(verifyOtp);
        const { data } = await mutate({
            email: props.email || undefined,
            otp: otpValue.value, // plain OTP now
            sessionKey: sessionKey.value,
            userId: props.userId || undefined,
        });

        if (!data?.verifyOtp?.status)
            throw new Error(data?.verifyOtp?.error || "Invalid code");
        emitClose(false);
        props.onVerified?.();
    } catch (e: any) {
        showError(e?.message || "Verification failed");
    } finally {
        loading.value = false;
    }
}

// Helpers
function resetTimers() {
    timeLeft.value = props.expiryTime || 300;
    resendTimer.value = props.resendDelay || 60;
    canResend.value = false;

    const expiryInterval = setInterval(() => {
        timeLeft.value--;
        if (timeLeft.value <= 0) {
            clearInterval(expiryInterval);
            showError("Code expired. Please request a new one.");
        }
    }, 1000);

    const resendInterval = setInterval(() => {
        resendTimer.value--;
        if (resendTimer.value <= 0) {
            clearInterval(resendInterval);
            canResend.value = true;
        }
    }, 1000);

    watch(
        () => props.isOpen,
        (val) => {
            if (!val) {
                clearInterval(expiryInterval);
                clearInterval(resendInterval);
            }
        },
        { immediate: true },
    );
}

function showError(message: string) {
    hasError.value = true;
    errorMessage.value = message;
    inputRefs.value[0]?.focus();
}

function clearError() {
    hasError.value = false;
    errorMessage.value = "";
}

function clearOtp() {
    otpDigits.value = Array(6).fill("");
}

function emitClose(value: boolean) {
    emit("update:isOpen", value);
    if (!value) {
        clearOtp();
        clearError();
    }
}

// Open watcher
watch(
    () => props.isOpen,
    async (val) => {
        if (val) {
            clearOtp();
            await nextTick();
            await sendOtp();
            useTimeoutFn(() => {
                inputRefs.value[0]?.focus?.();
            }, 50);
        }
    },
    { immediate: true },
);

onMounted(() => {
    resetTimers();
});
</script>
