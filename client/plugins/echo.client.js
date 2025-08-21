import Echo from "laravel-echo";
import Pusher from "pusher-js";

export default defineNuxtPlugin(() => {
    if (import.meta.server) return;
    window.Pusher = Pusher;
    const config = useRuntimeConfig();

    const echo = new Echo({
        broadcaster: "reverb",
        cluster: "mt1",
        disableStats: true,
        enabledTransports: ["ws", "wss"],
        forceTLS: false,
        key: config.public.REVERB_APP_KEY,
        scheme: config.public.REVERB_SCHEME,
        wsHost: config.public.REVERB_HOST,
        wsPort: Number(config.public.REVERB_PORT),
        wssPort: Number(config.public.REVERB_PORT),
    });

    return {
        provide: {
            echo,
        },
    };
});
