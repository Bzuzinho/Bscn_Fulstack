import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        react()
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        port: 5173, // porta do Vite (o Replit vai mapear para um porto público qualquer)
        proxy: {
          '/api': {
            target: 'http://127.0.0.1:3000', // Laravel a correr internamente
            changeOrigin: true,
          },
        },
      },
});
