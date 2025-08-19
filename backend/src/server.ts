import express, { Request, Response } from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from "dotenv";

// Chargement .env en premier
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000; // PORT Render

// Middleware de base ESSENTIEL
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuré pour Render
app.use(cors({
    origin: [
        'https://trogon-airways.onrender.com',
        'http://localhost:3000',
        'https://www.postman.com'
    ],
    credentials: true
}));

// Rate limiting
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));

// Configuration DB pour Render + GoDaddy
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
    } : undefined
};

// Pool global
const pool = mysql.createPool(dbConfig);

// ✅ ROUTE DE TEST SIMPLE (sans DB d'abord)
app.get('/', (req: Request, res: Response) => {
    res.json({ 
        message: '🚀 API Trogon Airways is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// ✅ ROUTE HEALTH CHECK (sans DB)
app.get('/health', (req: Request, res: Response) => {
    res.json({ 
        status: '✅ Healthy',
        server: 'Running',
        database: 'Not tested yet',
        time: new Date().toISOString()
    });
});

// ✅ ROUTE TEST DB (version simple)
app.get("/test-db", async (req: Request, res: Response) => {
    console.log('Test DB endpoint called');
    
    try {
        // Test de connexion simple
        const connection = await pool.getConnection();
        console.log('✅ Connected to DB');
        
        const [rows] = await connection.execute('SELECT 1 + 1 AS result');
        connection.release();
        
        res.json({ 
            success: true,
            message: '✅ Database connection successful',
            result: rows,
            timestamp: new Date().toISOString()
        });
        
    } catch (error: any) {
        console.error('❌ DB Connection error:', error);
        
        res.status(500).json({ 
            success: false,
            error: 'Database connection failed',
            message: error.message,
            code: error.code,
            // Info de debug seulement en dev
            ...(process.env.NODE_ENV !== 'production' && {
                stack: error.stack,
                dbConfig: {
                    host: process.env.DB_HOST,
                    database: process.env.DB_NAME,
                    user: process.env.DB_USER,
                    hasPassword: !!process.env.DB_PASSWORD
                }
            })
        });
    }
});

// ✅ ROUTE POUR VERIFIER LES VARIABLES ENV (debug)
app.get('/env-check', (req: Request, res: Response) => {
    res.json({
        port: process.env.PORT,
        node_env: process.env.NODE_ENV,
        db_host: process.env.DB_HOST ? '✅ Set' : '❌ Missing',
        db_user: process.env.DB_USER ? '✅ Set' : '❌ Missing',
        db_name: process.env.DB_NAME ? '✅ Set' : '❌ Missing',
        db_has_password: !!process.env.DB_PASSWORD,
        timestamp: new Date().toISOString()
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Database: ${process.env.DB_HOST ? 'Configured' : 'Not configured'}`);
});

// Gestion graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await pool.end();
    process.exit(0);
});