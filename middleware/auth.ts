export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();

    authStore.initializeAuth();

    if (authStore.isAuthenticated === true && to.path === '/') {
        return navigateTo('/dashboard');
    }

    if (authStore.isAuthenticated !== true) {
        return navigateTo('/');
    }
});
