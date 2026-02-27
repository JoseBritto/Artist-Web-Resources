import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/resources/',
    server: {
        allowedHosts: [
            'dj3d.me'
        ]
    }
})
