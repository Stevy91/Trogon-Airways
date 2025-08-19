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
    port: 3000,        // Frontend en dev local
    strictPort: true,
    host: true,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.BACKEND_PORT || 10000}`, // backend local
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // retire /api si nécessaire
      },
    },
  },
  build: {
    outDir: 'dist',       // dossier build frontend
    sourcemap: false,
  },
  preview: {
    port: process.env.PORT ? Number(process.env.PORT) : 3000, // Render injecte son port
    strictPort: true,
    host: true,
    allowedHosts: [
      "trogon-airways.onrender.com",
      ".onrender.com"
    ],
  }
});
