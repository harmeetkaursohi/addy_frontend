import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv';

// Load environment variables from the appropriate .env.local file
dotenv.config({
    path: `.env.${process.env.NODE_ENV || 'development'}`,
});


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
    ],
    server: {
        port: Number(process.env.PORT || 5143),
        hmr: {
            host: "localhost",
            port: Number(process.env.PORT || 5143),
            protocol: "wss",
        },
        watch: {
            usePolling: true
        }
    },
    build: {
        watch: false
    }
})



