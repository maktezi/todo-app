export const useLinks = () => {
    const auth = useAuthStore();

    const mainMenuItems = [
        {
            icon: "solar:home-outline",
            label: "Dashboard",
            permission: true,
            to: "/dashboard",
        },
        {
            icon: "solar:users-group-rounded-outline",
            label: "Users",
            permission: auth.can("view user"),
            to: "/users",
        },
        {
            icon: "solar:documents-broken",
            label: "Tasks",
            permission: auth.can("view task"),
            to: "/tasks",
        },
    ];

    return {
        mainMenuItems,
    };
};
