import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 5173,
        hmr: {
            host: "localhost",
            port: 5173,
            protocol: "wss",
        },
    },
    build: {
        watch: false
    }
})





