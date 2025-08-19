// backend/src/server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";



// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: ["https://trogon-airways.onrender.com", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ ROUTES API
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK", service: "Trogon Fullstack API" });
});

app.get("/api/test-db", async (req: Request, res: Response) => {
  try {
    res.json({ success: true, message: "Database test endpoint" });
  } catch (error) {
    res.status(500).json({ error: "steve" });
  }
});

// ✅ SERVIR LES FICHIERS STATICS DU FRONTEND
app.use(express.static(path.join(__dirname, "../dist")));

// ✅ TOUTES LES AUTRES ROUTES VERS LE FRONTEND
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Fullstack server running on port ${PORT}`);
  console.log(`🌍 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
});
