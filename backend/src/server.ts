// server/index.js (backend séparé)
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Vos routes API ici...
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", service: "Backend API" });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
});