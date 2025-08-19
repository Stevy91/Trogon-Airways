// server/index.js
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
const PORT = process.env.PORT || 10000;


// Middleware
app.use(helmet());
app.use(cors({
    origin: ['https://trogon-airways.onrender.com', 'http://localhost:3000'],
    credentials: true
}));


// ✅ ROUTES API
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', service: 'Trogon Fullstack API' });
});

app.get('/api/test-db', async (req, res) => {
    try {
        res.json({ success: true, message: 'Database test endpoint' });
    } catch (error) {
        res.status(500).json({ error: 'steve' });
    }
});


// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Fullstack server running on port ${PORT}`);
    console.log(`🌍 Frontend: http://localhost:${PORT}`);
    console.log(`🔧 API: http://localhost:${PORT}/api`);
});

