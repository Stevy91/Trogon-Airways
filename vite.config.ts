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
        port: Number(process.env.PORT) || 10000,
        strictPort: true,
        host: true,
        // ✅ Ajouter le proxy pour le backend en développement
        proxy: {
            '/api': {
                target: 'http://localhost:3001', // ou l'URL de votre backend
                changeOrigin: true,
                secure: false
            }
        }
    },
    preview: {
        port: Number(process.env.PORT) || 10000,
        strictPort: true,
        host: true,
        // ✅ CORRECTION : Autoriser le domaine Render
        allowedHosts: [
            "trogon-airways.onrender.com",
            ".onrender.com" // autoriser tous les sous-domaines render
        ],
    },
    // ✅ Configuration build pour production
    build: {
        outDir: 'dist',
        sourcemap: false
    }
});