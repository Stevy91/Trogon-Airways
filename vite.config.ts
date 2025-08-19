import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000, // Port dev
        proxy: {
            '/api': {
                target: 'https://trogon-backend.onrender.com',
                changeOrigin: true
            }
        }
    },
    build: {
        outDir: 'dist'
    }
});