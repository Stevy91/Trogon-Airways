"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const promise_1 = __importDefault(require("mysql2/promise"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'flight_booking'
};
app.get('/api/flights', async (req, res) => {
    try {
        const connection = await promise_1.default.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM flights');
        await connection.end();
        res.json(rows);
    }
    catch (err) {
        console.error('Erreur:', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API TypeScript en ligne sur http://localhost:${PORT}`);
});
