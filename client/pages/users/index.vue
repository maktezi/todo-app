<template>
    <div class="pt-2 md:px-4 px-2">
        <UTabs
            :ui="{
                list: {
                    base: 'relative flex whitespace-nowrap max-w-xl',
                },
            }"
            :items="items"
        >
            <template #manage-user>
                <ManageUser />
            </template>
            <template #manage-role>
                <ManageRole />
            </template>
            <template #manage-permission>
                <ManagePermission />
            </template>
        </UTabs>
    </div>
</template>

<script setup lang="ts">
import ManagePermission from "./components/manage-permission.vue";
import ManageRole from "./components/manage-role.vue";
import ManageUser from "./components/manage-user.vue";

const items = [
    {
        icon: "solar:users-group-rounded-outline",
        label: "Users",
        slot: "manage-user",
    },
    {
        icon: "solar:key-outline",
        label: "Roles",
        slot: "manage-role",
    },
    {
        icon: "solar:lock-outline",
        label: "Permissions",
        slot: "manage-permission",
    },
];

definePageMeta({
    layout: "app-layout",
    permission: ["view user", "view role", "view permission"],
});

const route = useRoute();
const routeName = computed(() => route.name ?? "Page");
const { appTitle, metaDescription } = useConstants();
useHead({
    meta: [
        {
            content: metaDescription,
            name: "description",
        },
    ],
    title: `${appTitle} - ${toTitleCase(String(routeName.value))}`,
});
</script>
