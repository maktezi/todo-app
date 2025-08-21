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
            label: "Documents",
            permission: auth.can("view document"),
            to: "/documents",
        },
    ];

    return {
        mainMenuItems,
    };
};
