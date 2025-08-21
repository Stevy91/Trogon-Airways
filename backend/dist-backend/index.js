// backend/src/server.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;
// __dirname pour ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Middleware
app.use(helmet());
app.use(cors({
    origin: [
        "https://trogon-airways.onrender.com",
        "http://localhost:3000",
    ],
    credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
// API routes
app.get("/api/health", (_req, res) => {
    res.json({ status: "OK", service: "Trogon Fullstack API" });
});
app.get("/api/locations", (_req, res) => {
    res.json([
        { id: 1, name: "Port-au-Prince" },
        { id: 2, name: "Cap-Haïtien" },
    ]);
});
// Servir frontend
app.use(express.static(path.join(__dirname, "../../dist")));
// Toutes les autres routes renvoient index.html
app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../../dist/index.html"));
});
// Démarrer serveur
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
