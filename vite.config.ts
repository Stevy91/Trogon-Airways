import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        port: 3000,
        strictPort: true,
        host: true,
        proxy: {
            '/api': {
                target: 'http://localhost:10000',
                changeOrigin: true
            }
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: false
    },
    preview: {
        port: 10000,
        strictPort: true,
        host: true,
        allowedHosts: [
            "trogon-airways.onrender.com",
            ".onrender.com"
        ]
    }
});