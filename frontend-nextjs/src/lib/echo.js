import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from '@/lib/axios';

// Initialise la connexion WebSocket avec Laravel Reverb via Laravel Echo
// Cette fonction doit être appelée uniquement côté navigateur (pas en SSR)
export const initEcho = () => {
    if (typeof window !== 'undefined') {
        // Pusher est requis par Echo même quand on utilise Reverb
        window.Pusher = Pusher;

        return new Echo({
            broadcaster: 'reverb',
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
            wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080,
            wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080,
            forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
            // On utilise notre instance axios (avec les cookies Sanctum) pour authentifier les canaux privés
            authorizer: (channel, options) => {
                return {
                    authorize: (socketId, callback) => {
                        axios.post('/broadcasting/auth', {
                            socket_id: socketId,
                            channel_name: channel.name
                        })
                        .then(response => {
                            callback(false, response.data);
                        })
                        .catch(error => {
                            callback(true, error);
                        });
                    }
                };
            },
        });
    }
    // On retourne null si on est côté serveur
    return null;
};
