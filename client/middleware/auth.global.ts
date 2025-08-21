export default defineNuxtRouteMiddleware((to, _from) => {
    const auth = useAuthStore();
    const noAuthRoutes = ["/", "/register"];
    const router = useRouter();
    const validRoutes = router
        .getRoutes()
        .map((route) => route.path.toLowerCase());

    const toPath = to.path.toLowerCase();

    if (!validRoutes.includes(toPath)) return navigateTo("/notfound");

    if (
        !auth.isAuthenticated &&
        !noAuthRoutes.includes(toPath) &&
        toPath !== "/login"
    )
        return navigateTo("/login");

    if (auth.isAuthenticated && toPath === "/login")
        return navigateTo("/dashboard");

    const requiredPermission = to.meta?.permission;
    if (requiredPermission && !auth.can(String(requiredPermission))) {
        return navigateTo("/unauthorized");
    }
});
