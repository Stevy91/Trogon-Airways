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
        proxy: {
            "/api": {
                target: "http://localhost:3014",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ""),
                ws: true,
                configure: (proxy) => {
                    proxy.on("error", (err) => {
                        console.error("Proxy error:", err);
                    });
                    proxy.on("proxyReq", (proxyReq) => {
                        console.log("Proxy request to:", proxyReq.path);
                    });
                },
            },
        },
    },
    preview: {
        port: Number(process.env.PORT) || 3000,
        strictPort: true,
        host: true, // écoute sur 0.0.0.0
    },
});
