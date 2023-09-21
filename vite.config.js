import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        // basicSsl()
    ],
    server: {
        host:true,
        port:5173,
        watch: {
            usePolling: false
        }
    },
    build: {
        watch: false
    }
})

