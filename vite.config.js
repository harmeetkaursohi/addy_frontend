import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';
import svgr from 'vite-plugin-svgr';

dotenv.config({
    path: `.env.${process.env.NODE_ENV || 'development'}`,
});

const PORT = process.env.PORT || 5143;
const VITE_HMR_HOST = process.env.VITE_HMR_HOST;
const VITE_HMR_PORT = process.env.VITE_HMR_PORT || 3000;
const VITE_HMR_PROTOCOL = process.env.VITE_HMR_PROTOCOL || 'ws';

export default defineConfig({
    plugins: [
        react(),
        svgr(), 
    ],
    
    server: {
        port: Number(PORT),
        hmr: {
            host: VITE_HMR_HOST,
            port: Number(VITE_HMR_PORT),
            protocol: VITE_HMR_PROTOCOL,
        },
        watch: {
            usePolling: true, 
        },
    },

    build: {
        watch: false, 
    },
});
