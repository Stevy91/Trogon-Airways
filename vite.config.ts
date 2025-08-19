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
        port: Number(process.env.PORT) || 3000,
        strictPort: true,
        host: true, // écoute sur 0.0.0.0
    },
    preview: {
        port: Number(process.env.PORT) || 3000,
        strictPort: true,
        host: true, // écoute sur 0.0.0.0
        allowedHosts: ["trogon-airways.onrender.com"], // autoriser ton domaine
    },
});
