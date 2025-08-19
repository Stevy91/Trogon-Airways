import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 10000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Middleware
app.use(helmet());
app.use(cors({
    origin: ['https://trogon-airways.onrender.com', 'http://localhost:3000'],
    credentials: true
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
// Routes API
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Trogon Fullstack API',
        timestamp: new Date().toISOString()
    });
});
// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../../dist')));
// Toutes les autres routes vers le frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});
// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Fullstack server running on port ${PORT}`);
    console.log(`🌍 Frontend: http://localhost:${PORT}`);
    console.log(`🔧 API: http://localhost:${PORT}/api`);
});
