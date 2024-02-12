import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv';

// Load environment variables from the appropriate .env.local file
dotenv.config({
    path: `.env.${process.env.NODE_ENV || 'development'}`, 
});

const PORT = process.env.PORT;
const VITE_HMR_HOST = process.env.VITE_HMR_HOST;
const VITE_HMR_PORT = process.env.VITE_HMR_PORT;
const VITE_HMR_PROTOCOL = process.env.VITE_HMR_PROTOCOL;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
    ],
    server: {
        port: Number(PORT || 5143),
        hmr: {
            host: VITE_HMR_HOST,
            port: Number(VITE_HMR_PORT),
            protocol: VITE_HMR_PROTOCOL,
        },
        watch: {
            usePolling: true
        }
    },
    build: {
        watch: false
    }
})



